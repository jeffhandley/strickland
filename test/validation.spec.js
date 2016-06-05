import expect from 'expect';
import { maxLength, maxValue, minLength, minValue, required, validator, validation, ValidationResult } from '../src';
import { mapValues } from 'lodash';

describe('validation', () => {
    const validators = [
        required({ message: 'required-validator' }),
        minLength(2, { message: 'minLength-validator' }),
        maxLength(2, { message: 'maxLength-validator' }),
        minValue('aa', { message: 'minValue-validator' }),
        maxValue('bb', { message: 'maxValue-validator' })
    ];

    const objectValidators = {
        first: validators,
        second: validators,
        nested: {
            field: validators
        }
    };

    describe('isValid', () => {
        it('can be used to determine if a value is valid', () => {
            const isValid = validation.isValid('ab', validators);
            expect(isValid).toBe(true);
        });

        it('can be used to determine if a value is invalid', () => {
            const isValid = validation.isValid('ccc', validators);
            expect(isValid).toBe(false);
        });

        it('can be used to determine if an object is valid', () => {
            const isValid = validation.isValid(
                {
                    first: 'aa',
                    second: 'bb',
                    nested: { field: 'aa' }
                },
                objectValidators
            );
            expect(isValid).toBe(true);
        });

        it('can be used to determine if an object is invalid', () => {
            const isValid = validation.isValid({ first: 'ccc', second: 'ddd' }, objectValidators);
            expect(isValid).toBe(false);
        });
    });

    describe('getErrors', () => {
        describe('for arrays of validators', () => {
            describe('when a required value is empty', () => {
                const errors = validation.getErrors('', validators);

                it('returns a single result', () => {
                    expect(errors.length).toBe(1);
                });

                it('has the "Required" message', () => {
                    expect(errors[0].message).toBe('required-validator');
                });
            });

            describe('when a non-empty value violates a single validator', () => {
                const errors = validation.getErrors('cc', validators);

                it('returns a single result', () => {
                    expect(errors.length).toBe(1);
                });

                it('has the message from the validator that failed', () => {
                    expect(errors[0].message).toBe('maxValue-validator');
                });
            });

            describe('when a value violates two validators', () => {
                const errors = validation.getErrors('ccc', validators);

                it('returns two errors', () => {
                    expect(errors.length).toBe(2);
                });

                it('has the messages from the validators that failed', () => {
                    const messages = errors.map((result) => result.message);
                    expect(messages).toEqual([ 'maxLength-validator', 'maxValue-validator' ]);
                });
            });
        });

        describe('for a validation object', () => {
            describe('returns an object of errors', () => {
                const results = validation.getErrors({ }, objectValidators);

                it('with one result per invalid validator', () => {
                    const expected = {
                        first: 1,
                        second: 1,
                        nested: {
                            field: 1
                        }
                    };

                    const actual = {
                        first: results.first.length,
                        second: results.second.length,
                        nested: {
                            field: results.nested.field.length
                        }
                    };

                    expect(actual).toEqual(expected);
                });

                it('including isValid and message', () => {
                    const expected = {
                        first: [ { isValid: false, message: 'required-validator' } ],
                        second: [ { isValid: false, message: 'required-validator' } ],
                        nested: {
                            field: [ { isValid: false, message: 'required-validator' }]
                        }
                    };

                    const actual = {
                        first: results.first.map(({ isValid, message }) => ({ isValid, message })),
                        second: results.second.map(({ isValid, message }) => ({ isValid, message })),
                        nested: {
                            field: results.nested.field.map(({ isValid, message }) => ({ isValid, message }))
                        }
                    };

                    expect(actual).toEqual(expected);
                });

                const singleInvalidField = validation.getErrors({
                    first: 'ab',
                    second: 'ab'
                }, objectValidators);

                it('including all validated fields', () => {
                    expect(singleInvalidField).toIncludeKeys([ 'first', 'second', 'nested' ]);
                });

                it('including nested validated fields', () => {
                    expect(singleInvalidField.nested).toIncludeKey('field');
                });

                it('with empty arrays for valid fields and populated arrays for invalid fields', () => {
                    const expected = {
                        first: 0,
                        second: 0,
                        nested: {
                            field: 1
                        }
                    };

                    const actual = {
                        first: singleInvalidField.first.length,
                        second: singleInvalidField.second.length,
                        nested: {
                            field: singleInvalidField.nested.field.length
                        }
                    };

                    expect(actual).toEqual(expected);
                });
            });
        });
    });

    describe('getResults', () => {
        describe('for arrays of validators', () => {
            describe('when a required value is empty', () => {
                const results = validation.getResults('', validators);

                it('returns a result for each validator', () => {
                    expect(results.length).toBe(validators.length);
                });

                it('has the isValid and message properties for all validators', () => {
                    const details = results.map((result) => ({
                        isValid: result.isValid,
                        message: result.message
                    }));

                    expect(details).toEqual([
                        { isValid: false, message: 'required-validator' },
                        { isValid: true, message: 'minLength-validator' },
                        { isValid: true, message: 'maxLength-validator' },
                        { isValid: true, message: 'minValue-validator' },
                        { isValid: true, message: 'maxValue-validator' }
                    ]);
                });
            });

            describe('when a non-empty value violates a single validator', () => {
                const results = validation.getResults('cc', validators);

                it('returns a result for each validator', () => {
                    expect(results.length).toBe(validators.length);
                });

                it('has the isValid and message properties for all validators', () => {
                    const details = results.map((result) => ({
                        isValid: result.isValid,
                        message: result.message
                    }));

                    expect(details).toEqual([
                        { isValid: true, message: 'required-validator' },
                        { isValid: true, message: 'minLength-validator' },
                        { isValid: true, message: 'maxLength-validator' },
                        { isValid: true, message: 'minValue-validator' },
                        { isValid: false, message: 'maxValue-validator' }
                    ]);
                });
            });

            describe('when a value violates two validators', () => {
                const results = validation.getResults('ccc', validators);

                it('returns a result for each validator', () => {
                    expect(results.length).toBe(validators.length);
                });

                it('has the isValid and message properties for all validators', () => {
                    const details = results.map((result) => ({
                        isValid: result.isValid,
                        message: result.message
                    }));

                    expect(details).toEqual([
                        { isValid: true, message: 'required-validator' },
                        { isValid: true, message: 'minLength-validator' },
                        { isValid: false, message: 'maxLength-validator' },
                        { isValid: true, message: 'minValue-validator' },
                        { isValid: false, message: 'maxValue-validator' }
                    ]);
                });
            });
        });

        describe('for a validation object', () => {
            const results = validation.getResults(
                { first: 'ab', second: 'bcd', third: 'not validated' },
                objectValidators
            );

            it('with validated properties', () => {
                expect(results).toIncludeKeys([ 'first', 'second', 'nested' ]);
            });

            it('without any unvalidated properties', () => {
                expect(results).toExcludeKey('third');
            });

            describe('with results on validated properties', () => {
                it('and one result per validator', () => {
                    const expected = {
                        first: objectValidators.first.length,
                        second: objectValidators.second.length,
                        nested: {
                            field: objectValidators.nested.field.length
                        }
                    };

                    const actual = {
                        first: results.first.length,
                        second: results.second.length,
                        nested: {
                            field: results.nested.field.length
                        }
                    };

                    expect(actual).toEqual(expected);
                });

                it('including isValid and message', () => {
                    const expected = {
                        first: [
                            { isValid: true, message: 'required-validator' },
                            { isValid: true, message: 'minLength-validator' },
                            { isValid: true, message: 'maxLength-validator' },
                            { isValid: true, message: 'minValue-validator' },
                            { isValid: true, message: 'maxValue-validator' }
                        ],
                        second: [
                            { isValid: true, message: 'required-validator' },
                            { isValid: true, message: 'minLength-validator' },
                            { isValid: false, message: 'maxLength-validator' },
                            { isValid: true, message: 'minValue-validator' },
                            { isValid: false, message: 'maxValue-validator' }
                        ]
                    };

                    const actual = {
                        first: results.first.map(({ isValid, message }) => ({ isValid, message })),
                        second: results.second.map(({ isValid, message }) => ({ isValid, message }))
                    };

                    expect(actual).toEqual(expected);
                });
            });
        });
    });


    describe('validate', () => {
        describe('for arrays of validators', () => {
            const result = validation.validate('ccc', validators);

            it('returns an object with isValid, results, and errors', () => {
                expect(result).toIncludeKeys([ 'isValid', 'results', 'errors' ]);
            });

            it('sets isValid to false when there are errors', () => {
                expect(result.isValid).toEqual(false);
            });

            it('includes results for every validator', () => {
                expect(result.results.length).toBe(validators.length);
            });

            it('includes errors for all invalid validators', () => {
                expect(result.errors.length).toBe(2);
            });

            it('only executes each validator once', () => {
                let validationCalls = 0;

                const countingValidator = validator(() => {
                    validationCalls++;
                    return true;
                });

                validation.validate('aa', [ countingValidator ]);
                expect(validationCalls).toBe(1);
            });
        });

        describe('for a validation object', () => {
            const result = validation.validate(
                { first: 'ab', second: 'bcd', third: 'not validated' },
                objectValidators
            );

            it('with validated properties', () => {
                expect(result).toIncludeKeys([ 'first', 'second', 'nested' ]);
            });

            it('without any unvalidated properties', () => {
                expect(result).toExcludeKey('third');
            });

            describe('with results on validated properties', () => {
                it('and isValid, results, and errors for each', () => {
                    const expected = {
                        first: { isValid: true, resultsLength: objectValidators.first.length, errorsLength: 0 },
                        second: { isValid: false, resultsLength: objectValidators.second.length, errorsLength: 2 },
                        nested: {
                            field: { isValid: false, resultsLength: objectValidators.nested.field.length, errorsLength: 1 }
                        }
                    };

                    function mapResult(resultField) {
                        return {
                            isValid: resultField.isValid,
                            resultsLength: resultField.results.length,
                            errorsLength: resultField.errors.length
                        };
                    }

                    const actual = {
                        first: mapResult(result.first),
                        second: mapResult(result.second),
                        nested: {
                            field: mapResult(result.nested.field)
                        }
                    };

                    expect(actual).toEqual(expected);
                });
            });

            it('only executes each validator once', () => {
                let validationCalls = 0;

                const countingValidator = validator(() => {
                    validationCalls++;
                    return true;
                });

                validation.validate({ field: 'aa' }, { field: [ countingValidator ] });
                expect(validationCalls).toBe(1);
            });
        });
    });

    describe('getErrorsFromResults', () => {
        const results = [
            new ValidationResult(false, { key: 'InvalidResult-1' }),
            new ValidationResult(true, { key: 'ValidResult-1' }),
            new ValidationResult(false, { key: 'InvalidResult-2' }),
            new ValidationResult(true, { key: 'ValidResult-2' })
        ];

        it('gets errors from an array of results', () => {
            const expected = [
                'InvalidResult-1',
                'InvalidResult-2'
            ];

            const actual = validation.getErrorsFromResults(results).map((error) => error.key);

            expect(actual).toEqual(expected);
        });

        it('gets errors from an object of results', () => {
            const objectResults = {
                first: results.map((result) => ({ ...result, field: 'first' })),
                second: results.map((result) => ({ ...result, field: 'second' })),
                nested: {
                    field: results.map((result) => ({ ...result, field: 'nested.field' }))
                }
            };

            const expected = {
                first: [ 'first-InvalidResult-1', 'first-InvalidResult-2' ],
                second: [ 'second-InvalidResult-1', 'second-InvalidResult-2' ],
                nested: {
                    field: [ 'nested.field-InvalidResult-1', 'nested.field-InvalidResult-2' ]
                }
            };

            const actual = validation.getErrorsFromResults(objectResults);
            const actualMapped = {
                first: actual.first.map((error) => 'first-' + error.key),
                second: actual.second.map((error) => 'second-' + error.key),
                nested: {
                    field: actual.nested.field.map((error) => 'nested.field-' + error.key)
                }
            };

            expect(actualMapped).toEqual(expected);
        });
    });

    describe('isValidFromResults', () => {
        const invalidResults = [
            new ValidationResult(false, { key: 'InvalidResult-1' }),
            new ValidationResult(true, { key: 'ValidResult-1' }),
            new ValidationResult(false, { key: 'InvalidResult-2' }),
            new ValidationResult(true, { key: 'ValidResult-2' })
        ];

        const validResults = [
            new ValidationResult(true, { key: 'ValidResult-1' }),
            new ValidationResult(true, { key: 'ValidResult-2' })
        ];

        it('detects invalid results from arrays of results', () => {
            const actual = validation.isValidFromResults(invalidResults);
            expect(actual).toBe(false);
        });

        it('detects invalid results from objects of results', () => {
            const objectResults = {
                first: validResults,
                second: validResults,
                nested: {
                    field: invalidResults
                }
            };

            const actual = validation.isValidFromResults(objectResults);
            expect(actual).toBe(false);
        });

        it('detects valid results from arrays of results', () => {
            const actual = validation.isValidFromResults(validResults);
            expect(actual).toBe(true);
        });

        it('detects valid results from objects of results', () => {
            const objectResults = {
                first: validResults,
                second: validResults,
                nested: {
                    field: validResults
                }
            };

            const actual = validation.isValidFromResults(objectResults);
            expect(actual).toBe(true);
        });
    });
});
