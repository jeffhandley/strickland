import formatResult from '../src/formatResult';
import {required, minLength, maxLength} from '../src/strickland';

describe('formatResult', () => {
    it('is a function', () => {
        expect(formatResult).toBeInstanceOf(Function);
    });

    describe('throws', () => {
        it('if the formatter is not defined', () => {
            expect(() => formatResult()).toThrow();
        });

        it('if the formatter is an object', () => {
            expect(() => formatResult({})).toThrow();
        });

        it('if the formatter is an array', () => {
            expect(() => formatResult([])).toThrow();
        });
    });

    describe('does not throw', () => {
        it('if the formatter is a function and the validator is a function', () => {
            expect(() => formatResult((result) => result, (value) => true)).not.toThrow();
        });

        it('if the formatter is a function and the validator is an object', () => {
            expect(() => formatResult((result) => result, {})).not.toThrow();
        });

        it('if the formatter is a function and the validator is an array', () => {
            expect(() => formatResult((result) => result, [])).not.toThrow();
        });
    });

    describe('returns a function', () => {
        it('for performing validation', () => {
            const formatter = (result) => result;
            const validator = (value) => true;

            expect(formatResult(formatter, validator)).toBeInstanceOf(Function);
        });

        describe('that calls the wrapped validator', () => {
            const validator = jest.fn();
            const formatter = jest.fn((result) => result);

            const validate = formatResult(formatter, validator);

            validate('ABC', {contextProp: 'propValue'});

            it('passing the value', () => {
                expect(validator).toHaveBeenCalledWith(
                    'ABC',
                    expect.anything()
                );
            });

            it('passing the validation context', () => {
                expect(validator).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({
                        contextProp: 'propValue'
                    })
                );
            });
        });
    });

    describe('can be used for the objectProps validator (using the object convention)', () => {
        const validateName = jest.fn(() => false);

        const formatter = jest.fn((result) => ({
            ...result,
            formatted: true
        }));

        const validate = formatResult(formatter, {
            name: validateName
        });

        const result = validate({name: 'ABC'});

        it('calling the formatter', () => {
            expect(formatter).toHaveBeenCalledWith(
                // result
                expect.objectContaining({
                    isValid: false,
                    objectProps: expect.objectContaining({
                        name: expect.objectContaining({
                            isValid: false,
                            value: 'ABC'
                        })
                    })
                }),

                // middleware context
                expect.objectContaining({
                    value: expect.objectContaining({name: 'ABC'})
                })
            );
        });

        describe('applying the formatter', () => {
            it('to sync results', () => {
                expect(result).toMatchObject({
                    isValid: false,
                    value: expect.objectContaining({name: 'ABC'}),
                    formatted: true
                });
            });

            describe('to async results', () => {
                const asyncValidate = () => Promise.resolve({
                    isValid: true,
                    returnedAsync: true
                });

                const formatter = (result) => ({
                    ...result,
                    formatted: true,
                    formattedAsync: !!result.objectProps.name.returnedAsync
                });

                const validate = formatResult(formatter, {
                    name: asyncValidate
                });

                const asyncResult = validate({name: 'ABC'});

                it('on the sync result that has async results waiting', () => {
                    expect(asyncResult).toMatchObject({
                        isValid: false,
                        formatted: true,
                        formattedAsync: false
                    });
                });

                it('on the async result after calling validateAsync', () => {
                    return expect(asyncResult.validateAsync()).resolves.toMatchObject({
                        isValid: true,
                        formatted: true,
                        formattedAsync: true
                    });
                });
            });
        });

        it('adding a validationErrors array to the result', () => {
            const withValidationErrors = (result) => ({
                ...result,
                validationErrors: Object.keys(result.objectProps)
                    .filter((propName) => !result.objectProps[propName].isValid && !result.objectProps[propName].validateAsync)
                    .map((propName) => ({
                        propName,
                        ...result.objectProps[propName]
                    }))
            });

            const validateWithValidationErrors = formatResult(withValidationErrors, {
                name: validateName
            });

            const resultWithValidationErrors = validateWithValidationErrors({name: 'ABC'});

            expect(resultWithValidationErrors).toMatchObject({
                validationErrors: [
                    expect.objectContaining({
                        propName: 'name',
                        value: 'ABC',
                        isValid: false
                    })
                ]
            });
        });

        it('adding a flattened array of validationErrors for nested objects', () => {
            const withValidationErrors = (result) => ({
                ...result,
                validationErrors: Object.keys(result.objectProps)
                    .filter((propName) => !result.objectProps[propName].isValid && !result.objectProps[propName].validateAsync)
                    .map((propName) => ({
                        propName,
                        ...result.objectProps[propName],
                    }))
                    .reduce((accumulator, {objectProps, every, validationErrors, ...propError}) => {
                        accumulator.push(propError);

                        function addNestedValidationErrors(parentProp, nestedValidationErrors) {
                            if (nestedValidationErrors) {
                                nestedValidationErrors.forEach(({objectProps, validationErrors, propName, ...errorResult}) => {
                                    const nestedPropName = `${parentProp}:${propName}`;

                                    accumulator.push({
                                        propName: nestedPropName,
                                        ...errorResult
                                    });

                                    addNestedValidationErrors(nestedPropName, validationErrors);
                                });
                            }
                        }

                        addNestedValidationErrors(propError.propName, validationErrors);

                        return accumulator;
                    }, [])
            });

            const validateObject = formatResult(withValidationErrors, {
                name: [required(), minLength(1), maxLength(3)],
                address: [required(), formatResult(withValidationErrors, {
                    street1: [required(), minLength(1), maxLength(3)],
                    street2: [minLength(1), maxLength(3)],
                    city: [required(), minLength(1), maxLength(3)],
                    state: [required(), minLength(2), maxLength(2)],
                    postal: [required(), minLength(1), maxLength(3)]
                })],
                employer: formatResult(withValidationErrors, {
                    name: [required(), minLength(1), maxLength(3)],
                    address: [required(), formatResult(withValidationErrors, {
                        street1: [required(), minLength(1), maxLength(3)],
                        street2: [minLength(1), maxLength(3)],
                        city: [required(), minLength(1), maxLength(3)],
                        state: [required(), minLength(2), maxLength(2)],
                        postal: [required(), minLength(1), maxLength(3)]
                    })]
                })
            });

            const data = {
                name: 'Marty',
                address: {
                    city: 'Hill Valley',
                    state: 'CA'
                },
                employer: {
                    address: {
                        city: 'Hill Valley',
                        state: 'CA'
                    }
                }
            };

            const objectResult = validateObject(data);

            expect(objectResult).toMatchObject({
                isValid: false,
                validationErrors: [
                    expect.objectContaining({
                        propName: 'name',
                        isValid: false,
                        maxLength: 3
                    }),
                    expect.objectContaining({
                        propName: 'address',
                        isValid: false,
                    }),
                    expect.objectContaining({
                        propName: 'address:street1',
                        isValid: false,
                        required: true
                    }),
                    expect.objectContaining({
                        propName: 'address:city',
                        isValid: false,
                        maxLength: 3
                    }),
                    expect.objectContaining({
                        propName: 'address:postal',
                        isValid: false,
                        required: true
                    }),
                    expect.objectContaining({
                        propName: 'employer',
                        isValid: false
                    }),
                    expect.objectContaining({
                        propName: 'employer:name',
                        isValid: false,
                        required: true
                    }),
                    expect.objectContaining({
                        propName: 'employer:address',
                        isValid: false
                    }),
                    expect.objectContaining({
                        propName: 'employer:address:street1',
                        isValid: false,
                        required: true
                    }),
                    expect.objectContaining({
                        propName: 'employer:address:city',
                        isValid: false,
                        maxLength: 3
                    }),
                    expect.objectContaining({
                        propName: 'employer:address:postal',
                        isValid: false,
                        required: true
                    })
                ]
            });
        });
    });

    describe('can be used for the every validator (using the array convention)', () => {
        const validateValue = jest.fn(() => false);

        const formatter = jest.fn((result) => ({
            ...result,
            formatted: true
        }));

        const validate = formatResult(formatter, [validateValue]);

        const result = validate('ABC');

        it('calling the formatter', () => {
            expect(formatter).toHaveBeenCalledWith(
                // result
                expect.objectContaining({
                    isValid: false,
                    value: 'ABC'
                }),

                // middleware context
                expect.objectContaining({
                    value: 'ABC'
                })
            );
        });

        describe('applying the formatter', () => {
            it('to sync results', () => {
                expect(result).toMatchObject({
                    isValid: false,
                    value: 'ABC',
                    formatted: true
                });
            });

            describe('to async results', () => {
                const asyncValidate = () => Promise.resolve({
                    isValid: true,
                    returnedAsync: true
                });

                const formatter = (result) => ({
                    ...result,
                    formatted: true,
                    formattedAsync: !!result.returnedAsync
                });

                const validate = formatResult(formatter, [asyncValidate]);

                const asyncResult = validate('ABC');

                it('on the sync result that has async results waiting', () => {
                    expect(asyncResult).toMatchObject({
                        isValid: false,
                        formatted: true,
                        formattedAsync: false
                    });
                });

                it('on the async result after calling validateAsync', () => {
                    return expect(asyncResult.validateAsync()).resolves.toMatchObject({
                        isValid: true,
                        formatted: true,
                        formattedAsync: true
                    });
                });
            });
        });

        it('adding a validationErrors array to the result', () => {
            const withValidationErrors = (result) => ({
                ...result,
                validationErrors: result.every
                    .filter((everyResult) => !everyResult.isValid && !everyResult.validateAsync)
            });

            const validateWithValidationErrors = formatResult(withValidationErrors, [validateValue]);

            const resultWithValidationErrors = validateWithValidationErrors('ABC');

            expect(resultWithValidationErrors).toMatchObject({
                validationErrors: [
                    expect.objectContaining({
                        value: 'ABC',
                        isValid: false
                    })
                ]
            });
        });
    });
});
