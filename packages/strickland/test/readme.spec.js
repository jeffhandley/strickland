import validate, {getValidatorProps, validateAsync, required, compare, min, max, range, minLength, maxLength, length, every, each, some, props, form} from '../src/strickland';

describe('readme', () => {
    describe('introduction', () => {
        describe('validators', () => {
            it('As an arrow function', () => {
                expect(() => {
                    // eslint-disable-next-line no-unused-vars
                    const letterA = (value) => (value === 'A');
                }).not.toThrow();
            });

            it('As a traditional function', () => {
                expect(() => {
                    // eslint-disable-next-line no-unused-vars
                    function letterA(value) {
                        return (value === 'A');
                    }
                }).not.toThrow();
            });
        });

        it('validation', () => {
            expect(() => {
                function letterA(value) {
                    return (value === 'A');
                }

                validate(letterA, 'B');
            }).not.toThrow();
        });

        describe('validation results', () => {
            it('As a boolean', () => {
                function letterA(value) {
                    return (value === 'A');
                }

                const result = validate(letterA, 'B');

                expect(result).toMatchObject({
                    isValid: false,
                    value: 'B'
                });
            });

            it('As an object', () => {
                function letterA(value) {
                    return {
                        isValid: (value === 'A')
                    };
                }

                const result = validate(letterA, 'B');

                expect(result).toMatchObject({
                    isValid: false,
                    value: 'B'
                });
            });
        });
    });

    describe('extensibility', () => {
        it('validator factories', () => {
            function letter(letterParam) {
                return (value) => (value === letterParam);
            }

            const validator = letter('B');
            const result = validate(validator, 'B');

            expect(result).toMatchObject({
                isValid: true,
                value: 'B'
            });
        });

        it('validation context', () => {
            function letter(letterParam) {
                return function validateLetter(value, context) {
                    // Copy the param instead of overriding
                    // `letterParam` with the function result
                    let letterValue = letterParam;

                    if (typeof letterValue === 'function') {
                        letterValue = letterValue(context);
                    }

                    return (value === letterValue);
                }
            }

            const validator = letter((context) => context.letter);
            const result = validate(validator, 'B', { letter: 'A' });

            expect(result).toMatchObject({
                isValid: false,
                value: 'B'
            });
        });

        it('validation result props', () => {
            function letter(letterParam) {
                return function validateLetter(value, context) {
                    // Copy the param instead of overriding
                    // `letterParam` with the function result
                    let letterValue = letterParam;

                    if (typeof letterValue === 'function') {
                        letterValue = letterValue(context);
                    }

                    return {
                        message: `Must match "${letterValue}"`,
                        isValid: (value === letterValue)
                    };
                }
            }

            const validator = letter('B');
            const result = validate(validator, 'A');

            expect(result).toMatchObject({
                message: 'Must match "B"',
                isValid: false,
                value: 'A'
            });
        });

        it('pattern', () => {
            function letter(letterParam, validatorProps) {
                return function validateLetter(value, context) {
                    // Copy the param instead of overriding
                    // `letterParam` with the function result
                    let letterValue = letterParam;

                    if (typeof letterValue === 'function') {
                        letterValue = letterValue(context);
                    }

                    return {
                        message: `Must match "${letterValue}"`,
                        ...validatorProps,
                        letter: letterValue,
                        isValid: (value === letterValue)
                    };
                }
            }

            const termsAccepted = letter('Y', {
                fieldName: 'acceptTerms',
                message: 'Enter the letter "Y" to accept the terms'
            });

            const termsEntered = 'N';

            const result = validate(termsAccepted, termsEntered);

            expect(result).toMatchObject({
                fieldName: 'acceptTerms',
                message: 'Enter the letter "Y" to accept the terms',
                letter: 'Y',
                isValid: false,
                value: 'N'
            });
        });

        describe('getValidatorProps', () => {
            function letter(...params) {
                return function validateLetter(value, context) {
                    const validatorProps = getValidatorProps(

                        ['letter'], // named props, in their param order
                        params, // the param array supplied to the validator
                        value, // the value being validated
                        context, // the validation context
                        {letter: 'A'} // default named prop values
                    );

                    return {
                        message: `Must match "${validatorProps.letter}"`,
                        ...validatorProps,
                        isValid: (value === validatorProps.letter)
                    };
                }
            }

            it('letter A', () => {
                const letterA = letter('A');
                const result = validate(letterA, 'B');

                expect(result).toMatchObject({
                    isValid: false,
                    value: 'B',
                    letter: 'A'
                });
            });

            it('letter from context', () => {
                const letterFromContext = letter((context) => context.letter);
                const result = validate(letterFromContext, 'B', {letter: 'C'});

                expect(result).toMatchObject({
                    isValid: false,
                    value: 'B',
                    letter: 'C'
                });
            });

            it('letter A with props', () => {
                const letterAwithProps = letter('A', {message: 'Must be "A"'});
                const result = validate(letterAwithProps, 'B');

                expect(result).toMatchObject({
                    isValid: false,
                    value: 'B',
                    letter: 'A',
                    message: 'Must be "A"'
                });
            });

            it('letter from context with props', () => {
                const letterFromContextWithProps = letter((context) => context.letter, {fieldName: 'acceptTerms'});
                const result = validate(letterFromContextWithProps, 'N', {letter: 'Y'});

                expect(result).toMatchObject({
                    isValid: false,
                    value: 'N',
                    letter: 'Y',
                    fieldName: 'acceptTerms'
                });
            });

            it('props from context', () => {
                const propsFromContext = letter((context) => ({
                    letter: context.letter,
                    message: `Must be "${context.letter}"`
                }));

                const result = validate(propsFromContext, 'B', {letter: 'C'});

                expect(result).toMatchObject({
                    isValid: false,
                    value: 'B',
                    letter: 'C',
                    message: 'Must be "C"'
                });
            });
        });
    });

    describe('validators', () => {
        describe('required', () => {
            it('usage', () => {
                const nameRequired = required({
                    message: 'Name is required'
                });

                const result = validate(nameRequired, '');

                expect(result).toMatchObject({
                    isValid: false,
                    value: '',
                    required: true,
                    message: 'Name is required'
                });
            });

            describe('validator props', () => {
                it('required by default', () => {
                    const a = required();
                    expect(validate(a, '')).toMatchObject({
                        isValid: false,
                        required: true
                    })
                });

                it('specifying false', () => {
                    const b = required(false);
                    expect(validate(b, '')).toMatchObject({
                        isValid: true,
                        required: false
                    })
                });

                it('specifying validator props', () => {
                    const c = required(
                        true,
                        {message: 'Name is required'}
                    );

                    expect(validate(c, '')).toMatchObject({
                        isValid: false,
                        required: true,
                        message: 'Name is required'
                    })
                });

                it('using a function to resolve the required prop along with validator props', () => {
                    const d = required(
                        (/*context*/) => true,
                        {message: 'Name is required'}
                    );

                    expect(validate(d, '')).toMatchObject({
                        isValid: false,
                        required: true,
                        message: 'Name is required'
                    })
                });

                it('using a function to resolve the required prop along with a function to resolve validator props', () => {
                    const e = required(
                        (context) => context.required,
                        (context) => ({
                            message: context.required ?
                                'Name is required' :
                                'Name is optional'
                        }
                        )
                    );

                    expect(validate(e, '', {required: true})).toMatchObject({
                        isValid: false,
                        required: true,
                        message: 'Name is required'
                    })

                    expect(validate(e, '', {required: false})).toMatchObject({
                        isValid: true,
                        required: false,
                        message: 'Name is optional'
                    })
                });

                it('using a function to resolve validator props', () => {
                    const f = required((context) => ({
                        required: context.required,
                        message: context.required ?
                            'Name is required' :
                            'Name is optional'
                    }));

                    expect(validate(f, '', {required: true})).toMatchObject({
                        isValid: false,
                        required: true,
                        message: 'Name is required'
                    })

                    expect(validate(f, '', {required: false})).toMatchObject({
                        isValid: true,
                        required: false,
                        message: 'Name is optional'
                    })
                });
            });
        });

        describe('compare', () => {
            it('as the first parameter to the factory', () => {
                const a = compare('A', {
                    message: 'Must be the letter "A"'
                });

                expect(validate(a, 'Z')).toMatchObject({
                    isValid: false,
                    compare: 'A',
                    value: 'Z',
                    message: 'Must be the letter "A"'
                });
            });

            it('as a named prop', () => {
                const b = compare({
                    compare: 'B',
                    message: 'Must be the letter "B"'
                });

                expect(validate(b, 'Z')).toMatchObject({
                    isValid: false,
                    compare: 'B',
                    value: 'Z',
                    message: 'Must be the letter "B"'
                });
            });

            it('as a function that resolves to the comparison value', () => {
                const c = compare(
                    (/*context*/) => 'C',
                    {message: 'Must match C'}
                );

                expect(validate(c, 'Z')).toMatchObject({
                    isValid: false,
                    compare: 'C',
                    value: 'Z',
                    message: 'Must match C'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const d = compare((context) => ({
                    compare: context.compare,
                    message: `Must match "${context.compare}"`
                }));

                expect(validate(d, 'Z', {compare: 'Y'})).toMatchObject({
                    isValid: false,
                    compare: 'Y',
                    value: 'Z',
                    message: 'Must match "Y"'
                });
            });
        });

        describe('min', () => {
            it('as the first parameter to the factory', () => {
                const a = min(
                    1,
                    {message: 'Must be at least 1'}
                );

                expect(validate(a, 5)).toMatchObject({
                    isValid: true,
                    value: 5,
                    min: 1,
                    message: 'Must be at least 1'
                });
            });

            it('as a named prop', () => {
                const b = min({
                    min: 2,
                    message: 'Must be at least 2'}
                );

                expect(validate(b, 5)).toMatchObject({
                    isValid: true,
                    value: 5,
                    min: 2,
                    message: 'Must be at least 2'
                });
            });

            it('as a function that resolves to the min value', () => {
                const c = min((/*context*/) =>
                    3,
                {message: 'Must be at least 3'}
                );

                expect(validate(c, 5)).toMatchObject({
                    isValid: true,
                    value: 5,
                    min: 3,
                    message: 'Must be at least 3'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const d = min((context) => ({
                    min: context.min,
                    message: `Must be at least ${context.min}`
                }));

                expect(validate(d, 5, {min: 4})).toMatchObject({
                    isValid: true,
                    value: 5,
                    min: 4,
                    message: 'Must be at least 4'
                });
            });
        });

        describe('max', () => {
            it('as the first parameter to the factory', () => {
                const a = max(
                    1,
                    {message: 'Must be at most 1'}
                );

                expect(validate(a, 5)).toMatchObject({
                    isValid: false,
                    value: 5,
                    max: 1,
                    message: 'Must be at most 1'
                });
            });

            it('as a named prop', () => {
                const b = max({
                    max: 2,
                    message: 'Must be at most 2'}
                );

                expect(validate(b, 5)).toMatchObject({
                    isValid: false,
                    value: 5,
                    max: 2,
                    message: 'Must be at most 2'
                });
            });

            it('as a function that resolves to the max value', () => {
                const c = max((/*context*/) =>
                    3,
                {message: 'Must be at most 3'}
                );

                expect(validate(c, 5)).toMatchObject({
                    isValid: false,
                    value: 5,
                    max: 3,
                    message: 'Must be at most 3'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const d = max((context) => ({
                    max: context.max,
                    message: `Must be at most ${context.max}`
                }));

                expect(validate(d, 5, {max: 4})).toMatchObject({
                    isValid: false,
                    value: 5,
                    max: 4,
                    message: 'Must be at most 4'
                });
            });
        });

        describe('range', () => {
            it('as the first two parameters to the factory', () => {
                const a = range(
                    10,
                    20,
                    {message: 'Must be between 10 and 20'}
                );

                expect(validate(a, 5)).toMatchObject({
                    isValid: false,
                    value: 5,
                    min: 10,
                    max: 20,
                    message: 'Must be between 10 and 20'
                });
            });

            it('as named props', () => {
                const b = range({
                    min: 10,
                    max: 20,
                    message: 'Must be between 10 and 20'
                });

                expect(validate(b, 5)).toMatchObject({
                    isValid: false,
                    value: 5,
                    min: 10,
                    max: 20,
                    message: 'Must be between 10 and 20'
                });
            });

            it('as functions that resolve the min and max values', () => {
                const c = range(
                    (/*context*/) => 10,
                    (/*context*/) => 20,
                    {message: 'Must be between 10 and 20'}
                );

                expect(validate(c, 5)).toMatchObject({
                    isValid: false,
                    value: 5,
                    min: 10,
                    max: 20,
                    message: 'Must be between 10 and 20'
                });
            });

            it('as a function that resolves to have the named props', () => {
                const d = range((context) => ({
                    min: context.min,
                    max: context.max,
                    message: `Must be between ${context.min} and ${context.max}`
                }));

                expect(validate(d, 5, {min: 10, max: 20})).toMatchObject({
                    isValid: false,
                    value: 5,
                    min: 10,
                    max: 20,
                    message: 'Must be between 10 and 20'
                });
            });
        });

        describe('minLength', () => {
            it('as the first parameter to the factory', () => {
                const a = minLength(
                    1,
                    {message: 'Must have a length of at least 1'}
                );

                expect(validate(a, 'ABCDE')).toMatchObject({
                    isValid: true,
                    value: 'ABCDE',
                    minLength: 1,
                    message: 'Must have a length of at least 1'
                });
            });

            it('as a named prop', () => {
                const b = minLength({
                    minLength: 2,
                    message: 'Must have a length of at least 2'
                });

                expect(validate(b, 'ABCDE')).toMatchObject({
                    isValid: true,
                    value: 'ABCDE',
                    minLength: 2,
                    message: 'Must have a length of at least 2'
                });
            });

            it('as a function that resolves to the minLength value', () => {
                const c = minLength(
                    (/*context*/) => 3,
                    {message: 'Must have a length of at least 3'}
                );

                expect(validate(c, 'ABCDE')).toMatchObject({
                    isValid: true,
                    value: 'ABCDE',
                    minLength: 3,
                    message: 'Must have a length of at least 3'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const d = minLength((context) => ({
                    minLength: context.minLength,
                    message: `Must have a length of at least ${context.minLength}`
                }));

                expect(validate(d, 'ABCDE', {minLength: 4})).toMatchObject({
                    isValid: true,
                    value: 'ABCDE',
                    minLength: 4,
                    message: 'Must have a length of at least 4'
                });
            });
        });

        describe('maxLength', () => {
            it('as the first parameter to the factory', () => {
                const a = maxLength(
                    1,
                    {message: 'Must have a length of at most 1'}
                );

                expect(validate(a, 'ABCDE')).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    maxLength: 1,
                    message: 'Must have a length of at most 1'
                });
            });

            it('as a named prop', () => {
                const b = maxLength({
                    maxLength: 2,
                    message: 'Must have a length of at most 2'
                });

                expect(validate(b, 'ABCDE')).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    maxLength: 2,
                    message: 'Must have a length of at most 2'
                });
            });

            it('as a function that resolves to the maxLength value', () => {
                const c = maxLength(
                    (/*context*/) => 3,
                    {message: 'Must have a length of at most 3'}
                );

                expect(validate(c, 'ABCDE')).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    maxLength: 3,
                    message: 'Must have a length of at most 3'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const d = maxLength((context) => ({
                    maxLength: context.maxLength,
                    message: `Must have a length of at most ${context.maxLength}`
                }));

                expect(validate(d, 'ABCDE', {maxLength: 4})).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    maxLength: 4,
                    message: 'Must have a length of at most 4'
                });
            });
        });

        describe('length', () => {
            it('as the first two parameters to the factory', () => {
                const a = length(
                    10,
                    20,
                    {message: 'Must have a length between 10 and 20'}
                );

                expect(validate(a, 'ABCDE')).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    minLength: 10,
                    maxLength: 20,
                    message: 'Must have a length between 10 and 20'
                });
            });

            it('as named props', () => {
                const b = length({
                    minLength: 10,
                    maxLength: 20,
                    message: 'Must have a length between 10 and 20'
                });

                expect(validate(b, 'ABCDE')).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    minLength: 10,
                    maxLength: 20,
                    message: 'Must have a length between 10 and 20'
                });
            });

            it('as functions that resolve the minLength and maxLength values', () => {
                const c = length(
                    (/*context*/) => 10,
                    (/*context*/) => 20,
                    {message: 'Must have a length between 10 and 20'}
                );

                expect(validate(c, 'ABCDE')).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    minLength: 10,
                    maxLength: 20,
                    message: 'Must have a length between 10 and 20'
                });
            });

            it('as a function that resolves to have the named props', () => {
                const d = length((context) => ({
                    minLength: context.minLength,
                    maxLength: context.maxLength,
                    message: `Must have a length between ${context.minLength} and ${context.maxLength}`
                }));

                expect(validate(d, 'ABCDE', {minLength: 10, maxLength: 20})).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    minLength: 10,
                    maxLength: 20,
                    message: 'Must have a length between 10 and 20'
                });
            });
        });
    });

    describe('composition', () => {
        it('arrays of validators', () => {
            function everyValidator(validators) {
                return function validateEvery(value, context) {
                    let result = {
                        value,
                        isValid: true
                    };

                    validators.every((validator) => {
                        let validatorResult = validate(
                            validator, value, context
                        );

                        result = {
                            ...result,
                            ...validatorResult,
                            isValid: validatorResult.isValid
                        };

                        return result.isValid;
                    });

                    return result;
                }
            }

            const mustExistWithLength5 = everyValidator([required(), minLength(5)]);
            const result = validate(mustExistWithLength5, '1234', {
                message: 'Must have a length of at least 5'
            });

            expect(result).toMatchObject({
                isValid: false,
                value: '1234',
                required: true,
                minLength: 5,
                length: 4
            });
        });

        describe('every', () => {
            it('atLeast5Chars', () => {
                const atLeast5Chars = every(
                    [
                        required(),
                        minLength(5)
                    ],
                    {message: 'Must have at least 5 characters'}
                );

                const result = validate(atLeast5Chars, '1234');

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    length: 4,
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters'
                });
            });

            it('requiredWithMinLength', () => {
                const requiredWithMinLength = every(
                    [
                        required(),
                        minLength((context) => context.minLength)
                    ],
                    (context) => ({message: `Must have at least ${context.minLength} characters`})
                );

                const result = validate(requiredWithMinLength, '1234', {minLength: 5});

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    length: 4,
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters'
                });
            });

            it('mustExistWithLength5to10', () => {
                const mustExistWithLength5to10 = every([
                    required({message: 'Required'}),
                    minLength(5, {message: 'Must have at least 5 characters'}),
                    maxLength(10, {message: 'Must have at most 10 characters'})
                ]);

                const result = validate(mustExistWithLength5to10, '1234');

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters',
                    every: [
                        {
                            isValid: true,
                            value: '1234',
                            required: true,
                            message: 'Required'
                        },
                        {
                            isValid: false,
                            value: '1234',
                            minLength: 5,
                            message: 'Must have at least 5 characters'
                        }
                    ]
                });
            });
        });

        describe('each', () => {
            it('atLeast5Chars', () => {
                const atLeast5Chars = each(
                    [
                        required(),
                        minLength(5)
                    ],
                    {message: 'Must have at least 5 characters'}
                );

                const result = validate(atLeast5Chars, '1234');

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    length: 4,
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters'
                });
            });

            it('requiredWithMinLength', () => {
                const requiredWithMinLength = each(
                    [
                        required(),
                        minLength((context) => context.minLength)
                    ],
                    (context) => ({message: `Must have at least ${context.minLength} characters`})
                );

                const result = validate(requiredWithMinLength, '1234', {minLength: 5});

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    length: 4,
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters'
                });
            });

            it('mustExistWithLength5to10', () => {
                const mustExistWithLength5to10 = each([
                    required({message: 'Required'}),
                    minLength(5, {message: 'Must have at least 5 characters'}),
                    maxLength(10, {message: 'Must have at most 10 characters'})
                ]);

                const result = validate(mustExistWithLength5to10, '1234');

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    required: true,
                    minLength: 5,
                    message: 'Must have at most 10 characters',
                    each: [
                        {
                            isValid: true,
                            value: '1234',
                            required: true,
                            message: 'Required'
                        },
                        {
                            isValid: false,
                            value: '1234',
                            minLength: 5,
                            message: 'Must have at least 5 characters'
                        },
                        {
                            isValid: true,
                            value: '1234',
                            maxLength: 10,
                            message: 'Must have at most 10 characters'
                        }
                    ]
                });
            });
        });

        describe('some', () => {
            const max5orMin10orValue7 = some([
                max(5),
                min(10),
                compare(7)
            ]);

            const result = validate(max5orMin10orValue7, 12);

            expect(result).toMatchObject({
                isValid: true,
                value: 12,
                max: 5,
                min: 10,
                some: [
                    {
                        isValid: false,
                        value: 12,
                        max: 5
                    },
                    {
                        isValid: true,
                        value: 12,
                        min: 10
                    }
                ]
            });
        });

        describe('props', () => {
            it('parameters', () => {
                const validateProps = props({
                    firstName: every([required(), length(2, 20)]),
                    lastName: every([required(), length(2, 20)]),
                    birthYear: range(1900, 2018)
                }, {
                    message: 'The person must be valid'
                });

                const result = validate(validateProps, {});

                expect(result).toMatchObject({
                    isValid: false,
                    message: 'The person must be valid'
                });
            });

            it('validation context', () => {
                const validateProps = props({
                    firstName: every([
                        required(),
                        length((context) => ({
                            minLength: context.minLength,
                            maxLength: context.maxLength
                        }))
                    ]),
                    lastName: every([
                        required(),
                        length((context) => ({
                            minLength: context.minLength,
                            maxLength: context.maxLength
                        }))
                    ]),
                    birthYear: range((context) => ({
                        min: context.min,
                        max: context.max
                    }))
                }, {
                    message: 'The person must be valid'
                });

                // Create a person
                const person = {
                    firstName: 'Stanford',
                    lastName: 'Strickland',
                    birthYear: 1925
                };

                const result = validate(validateProps, person, {
                    props: {
                        firstName: {
                            minLength: 5,
                            maxLength: 20
                        },
                        lastName: {
                            minLength: 8,
                            maxLength: 23
                        },
                        birthYear: {
                            min: 1900,
                            max: 2018
                        }
                    }
                });

                expect(result).toMatchObject({
                    props: {
                        firstName: {
                            minLength: 5,
                            maxLength: 20
                        },
                        lastName: {
                            minLength: 8,
                            maxLength: 23
                        },
                        birthYear: {
                            min: 1900,
                            max: 2018
                        }
                    }
                });
            });

            it('result properties', () => {
                // Define the rules for first name, last name, and birthYear
                const validatePersonProps = props({
                    firstName: every([required(), length(2, 20)]),
                    lastName: every([required(), length(2, 20)]),
                    birthYear: range(1900, 2018)
                });

                // Create a person
                const person = {
                    firstName: 'Stanford',
                    lastName: 'Strickland',
                    birthYear: 1925
                };

                const result = validate(validatePersonProps, person);

                expect(result).toMatchObject({
                    isValid: true,
                    value: person,
                    props: {
                        firstName: {
                            isValid: true,
                            value: 'Stanford',
                            required: true,
                            minLength: 2,
                            maxLength: 20,
                            every: [
                                {
                                    isValid: true,
                                    value: 'Stanford',
                                    required: true
                                },
                                {
                                    isValid: true,
                                    value: 'Stanford',
                                    minLength: 2,
                                    maxLength: 20
                                }
                            ]
                        },
                        lastName: {
                            isValid: true,
                            value: 'Strickland',
                            required: true,
                            minLength: 2,
                            maxLength: 20,
                            every: [
                                {
                                    isValid: true,
                                    value: 'Strickland',
                                    required: true
                                },
                                {
                                    isValid: true,
                                    value: 'Strickland',
                                    minLength: 2,
                                    maxLength: 20
                                }
                            ]
                        },
                        birthYear: {
                            isValid: true,
                            value: 1925,
                            min: 1900,
                            max: 2018
                        }
                    }
                });
            });
        });

        it('advanced object validation', () => {
            // Define the rules for first name, last name, and birthYear
            const validatePersonProps = props({
                firstName: every([required(), length(2, 20)]),
                lastName: every([required(), length(2, 20)]),
                birthYear: range(1900, 2018)
            });

            function stanfordStricklandBornIn1925(person) {
                if (!person) {
                    // If there's no person provided, return valid and
                    // rely on `required` to ensure a person exists
                    return true;
                }

                const {firstName, lastName} = person;

                if (firstName === 'Stanford' && lastName === 'Strickland') {
                    return (person.birthYear === 1925);
                }

                return true;
            }

            const validatePerson = every([
                required(),
                validatePersonProps,
                stanfordStricklandBornIn1925
            ]);

            // Create a person
            const person = {
                firstName: 'Stanford',
                lastName: 'Strickland',
                birthYear: 1925
            };

            const result = validate(validatePerson, person);
            expect(result.isValid).toBe(true);
        });

        it('nested objects', () => {
            const validatePerson = props({
                name: every([required(), length(5, 40)]),
                address: props({
                    street: props({
                        number: every([required(), range(1, 99999)]),
                        name: every([required(), length(2, 40)])
                    }),
                    city: required(),
                    state: every([required(), length(2, 2)])
                })
            });

            const person = {
                name: 'Marty McFly',
                address: {
                    street: {
                        number: 9303,
                        name: 'Lyon Drive'
                    },
                    city: 'Hill Valley',
                    state: 'CA'
                }
            };

            const result = validate(validatePerson, person);
            expect(result.isValid).toBe(true);
        });

        it('conventions', () => {
            const validatePerson = [
                required(),
                {
                    name: [required(), length(5, 40)],
                    address: [
                        required(),
                        {
                            street: [
                                required(),
                                {
                                    number: [required(), range(1, 99999)],
                                    name: [required(), length(2, 40)]
                                }
                            ],
                            city: required(),
                            state: [required(), length(2, 2)]
                        }
                    ]
                }
            ];

            const person = {
                name: 'Stanford Strickland',
                address: {
                    city: 'Hill Valley',
                    state: 'CA'
                }
            };

            const result = validate(validatePerson, person);
            expect(result.isValid).toBe(false);
        });

        describe('form', () => {
            const validatePerson = form({
                firstName: [required(), length(2, 20)],
                lastName: [required(), length(2, 20)],
                birthYear: range(1900, 2018)
            });

            // Initialize the person with only a firstName
            let person = {
                firstName: 'Stanford'
            };

            // Validate the firstName field
            let result = validate(validatePerson, person, {
                form: {
                    fields: ['firstName']
                }
            });

            it('validates firstName', () => {
                expect(result).toMatchObject({
                    isValid: false,
                    value: {
                        firstName: 'Stanford'
                    },
                    form: {
                        isComplete: false,
                        validationResults: {
                            firstName: {
                                isValid: true,
                                value: 'Stanford',
                                required: true,
                                minLength: 2,
                                maxLength: 20
                            }
                        },
                        validationErrors: []
                    }
                });
            });

            it('validates lastName', () => {
                // Add the lastName field
                person = {
                    firstName: 'Stanford',
                    lastName: 'Strickland'
                };

                // Validate the lastName field, build on
                // previous form validation results
                result = validate(validatePerson, person, {
                    form: {
                        ...result.form,
                        fields: ['lastName']
                    }
                });

                expect(result).toMatchObject({
                    isValid: false,
                    value: {
                        firstName: 'Stanford',
                        lastName: 'Strickland'
                    },
                    form: {
                        isComplete: false,
                        validationResults: {
                            firstName: {
                                isValid: true,
                                value: 'Stanford',
                                required: true,
                                minLength: 2,
                                maxLength: 20
                            },
                            lastName: {
                                isValid: true,
                                value: 'Strickland',
                                required: true,
                                minLength: 2,
                                maxLength: 20
                            }
                        },
                        validationErrors: []
                    }
                });
            });

            it('validates birthYear', () => {
                // Add a birthYear (that is invalid)
                person = {
                    ...person,
                    birthYear: 2020
                };

                // Validate the birthYear field
                result = validate(validatePerson, person, {
                    form: {
                        ...result.form,
                        fields: ['birthYear']
                    }
                });

                expect(result).toMatchObject({
                    isValid: false,
                    value: {
                        firstName: 'Stanford',
                        lastName: 'Strickland'
                    },
                    form: {
                        isComplete: true,
                        validationResults: {
                            firstName: {
                                isValid: true,
                                value: 'Stanford',
                                required: true,
                                minLength: 2,
                                maxLength: 20
                            },
                            lastName: {
                                isValid: true,
                                value: 'Strickland',
                                required: true,
                                minLength: 2,
                                maxLength: 20
                            },
                            birthYear: {
                                isValid: false,
                                value: 2020,
                                min: 1900,
                                max: 2018
                            }
                        },
                        validationErrors: [
                            {
                                fieldName: 'birthYear',
                                isValid: false,
                                value: 2020,
                                min: 1900,
                                max: 2018
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('async validation', () => {
        function usernameIsAvailable(username) {
            return new Promise((resolve) => {
                if (username === 'marty') {
                    // Resolve to an invalid validation result object
                    resolve({
                        isValid: false,
                        message: `"${username}" is not available`
                    });
                }

                // Resolve to a boolean
                resolve(true);
            });
        }

        describe('readme', () => {
            it('introduction', () => {
                expect.assertions(1);

                const result = validate(usernameIsAvailable, 'marty');

                return result.validateAsync.then((asyncResult) => {
                    expect(asyncResult).toMatchObject({
                        isValid: false,
                        value: 'marty',
                        message: '"marty" is not available'
                    });
                });
            });

            it('resolving', () => {
                expect.assertions(1);

                const result = validate(usernameIsAvailable, 'marty');
                const handleValidationResult = jest.fn();

                if (result.validateAsync instanceof Promise) {
                    return result.validateAsync.then((asyncResult) => handleValidationResult(asyncResult)).then(() => {
                        expect(handleValidationResult).toHaveBeenCalledWith(expect.objectContaining({
                            isValid: false,
                            value: 'marty',
                            message: '"marty" is not available'
                        }));
                    });
                } else {
                    handleValidationResult(result);
                    expect(handleValidationResult).not.toHaveBeenCalled(); // test should not reach here
                }
            });

            it('validateAsync', () => {
                expect.assertions(1);

                const result = validateAsync(usernameIsAvailable, 'marty');
                const handleValidationResult = jest.fn();

                return result.then((asyncResult) => handleValidationResult(asyncResult)).then(() => {
                    expect(handleValidationResult).toHaveBeenCalledWith(expect.objectContaining({
                        isValid: false,
                        value: 'marty',
                        message: '"marty" is not available'
                    }));
                });
            });
        });

        it('async arrays and objects', () => {
            expect.assertions(1);

            function validateCity(address) {
                return new Promise((resolve) => {
                    if (!address) {
                        resolve(true);
                    }

                    const {city, state} = address;

                    if (city === 'Hill Valley' && state !== 'CA') {
                        resolve({
                            isValid: false,
                            message: 'Hill Valley is in California'
                        });
                    } else {
                        resolve(true);
                    }
                });
            }

            const validatePerson = {
                name: [
                    required(),
                    length(2, 20, {
                        message: 'Name must be 2-20 characters'
                    })
                ],
                username: [
                    required(),
                    length(2, 20),
                    usernameIsAvailable
                ],
                address: [
                    required({message: 'Address is required'}),
                    {
                        street: [required(), length(2, 40)],
                        city: [required(), length(2, 40)],
                        state: [required(), length(2, 2)]
                    },
                    validateCity
                ]
            };

            const person = {
                name: 'Marty McFly',
                username: 'marty',
                address: {
                    street: '9303 Lyon Dr.',
                    city: 'Hill Valley',
                    state: 'WA'
                }
            };

            return validateAsync(validatePerson, person).then((result) => {
                expect(result).toMatchObject({
                    isValid: false,
                    props: {
                        name: {
                            isValid: true,
                            value: 'Marty McFly'
                        },
                        username: {
                            isValid: false,
                            value: 'marty',
                            message: '"marty" is not available'
                        },
                        address: {
                            isValid: false,
                            message: 'Hill Valley is in California',
                            props: {
                                street: {isValid: true},
                                city: {isValid: true},
                                state: {isValid: true}
                            }
                        }
                    }
                });
            });
        });

        describe('two-stage validation', () => {
            function usernameIsAvailableTwoStage(username) {
                if (!username) {
                    // Do not check availability of an empty username

                    // Return just a boolean - it will be
                    // converted to a valid result
                    return true;
                }

                // Return an initial result indicating the value is
                // not (yet) valid, but availability will be checked
                return {
                    isValid: false,
                    message: `Checking availability of "${username}"...`,
                    validateAsync: new Promise((resolve) => {
                        if (username === 'marty') {
                            resolve({
                                isValid: false,
                                message: `"${username}" is not available`
                            });
                        } else {
                            resolve({
                                isValid: true,
                                message: `"${username}" is available`
                            });
                        }
                    })
                };
            }

            const validateUser = {
                name: [required(), length(2, 20)],
                username: [required(), length(2, 20), usernameIsAvailableTwoStage]
            };

            const user = {
                name: 'Marty McFly',
                username: 'marty'
            };

            const result = validate(validateUser, user);

            it('first stage', () => {
                expect(result).toMatchObject({
                    isValid: false,
                    props: {
                        name: {
                            isValid: true,
                            value: 'Marty McFly'
                        },
                        username: {
                            isValid: false,
                            value: 'marty',
                            required: true,
                            minLength: 2,
                            maxLength: 20,
                            message: 'Checking availability of "marty"...',
                            validateAsync: expect.any(Promise)
                        }
                    },
                    validateAsync: expect.any(Promise)
                });
            });

            it('second stage', () => {
                expect.assertions(1);

                return result.validateAsync.then((asyncResult) => {
                    expect(asyncResult).toMatchObject({
                        isValid: false,
                        props: {
                            name: {
                                isValid: true,
                                value: 'Marty McFly'
                            },
                            username: {
                                isValid: false,
                                value: 'marty',
                                required: true,
                                minLength: 2,
                                maxLength: 20,
                                message: '"marty" is not available'
                            }
                        }
                    });
                });
            });
        });
    });
});
