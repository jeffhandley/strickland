import validate, {
    required,
    compare,
    min,
    max,
    range,
    minLength,
    maxLength,
    length
} from '../../src/strickland';

describe('docs', () => {
    describe('validators', () => {
        describe('required', () => {
            describe('usage', () => {
                it('nameRequired example', () => {
                    const nameRequired = required({
                        message: 'Name is required'
                    });

                    const result = validate(nameRequired, '');

                    expect(result).toMatchObject({
                        required: true,
                        message: 'Name is required',
                        isValid: false,
                        value: ''
                    });
                });

                it('required by default', () => {
                    const a = required();
                    expect(validate(a, '')).toMatchObject({
                        required: true,
                        isValid: false
                    });
                });

                describe('the required param specified as a boolean', () => {
                    it('when true', () => {
                        const requiredField = required(true);
                        expect(validate(requiredField, '')).toMatchObject({
                            required: true,
                            isValid: false
                        });
                    });

                    it('when true', () => {
                        const optionalField = required(false);
                        expect(validate(optionalField, '')).toMatchObject({
                            required: false,
                            isValid: true
                        });
                    });
                });

                it('supplying the `required` named prop', () => {
                    const nameRequired = required({
                        required: true,
                        message: '"Name" is required'
                    });

                    expect(validate(nameRequired, '')).toMatchObject({
                        required: true,
                        message: '"Name" is required',
                        isValid: false
                    });
                });

                it('using a function to resolve the required prop along with validator props', () => {
                    const requiredValidator = required((context) => ({
                        required: context.required,
                        message: context.required ?
                            '"Name" is required' :
                            '"Name" is optional'
                    }));

                    expect(validate(requiredValidator, '', {required: true})).toMatchObject({
                        required: true,
                        message: '"Name" is required',
                        isValid: false
                    });
                });
            });
        });

        describe('compare', () => {
            it('as a value param', () => {
                const letterA = compare('A');

                expect(validate(letterA, 'Z')).toMatchObject({
                    compare: 'A',
                    isValid: false
                });
            });

            it('as a named prop', () => {
                const letterB = compare({
                    compare: 'B',
                    message: 'Must be the letter "B"'
                });

                expect(validate(letterB, 'Z')).toMatchObject({
                    isValid: false,
                    compare: 'B',
                    value: 'Z',
                    message: 'Must be the letter "B"'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const letterValidator = compare((context) => ({
                    compare: context.compare,
                    message: `Must match "${context.compare}"`
                }));

                expect(validate(letterValidator, 'Z', {compare: 'Y'})).toMatchObject({
                    isValid: false,
                    compare: 'Y',
                    value: 'Z',
                    message: 'Must match "Y"'
                });
            });
        });

        describe('min', () => {
            it('as a value param', () => {
                const minOf3 = min(3);

                expect(validate(minOf3, 2)).toMatchObject({
                    min: 3,
                    isValid: false
                });
            });

            it('as a named prop', () => {
                const minOf2 = min({
                    min: 2,
                    message: 'Must be at least 2'}
                );

                expect(validate(minOf2, 5)).toMatchObject({
                    isValid: true,
                    value: 5,
                    min: 2,
                    message: 'Must be at least 2'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const minValidator = min((context) => ({
                    min: context.min,
                    message: `Must be at least ${context.min}`
                }));

                expect(validate(minValidator, 5, {min: 4})).toMatchObject({
                    isValid: true,
                    value: 5,
                    min: 4,
                    message: 'Must be at least 4'
                });
            });
        });

        describe('max', () => {
            it('as a value param', () => {
                const maxOf3 = max(3);

                expect(validate(maxOf3, 4)).toMatchObject({
                    max: 3,
                    isValid: false
                });
            });

            it('as a named prop', () => {
                const maxOf2 = max({
                    max: 2,
                    message: 'Must be at most 2'}
                );

                expect(validate(maxOf2, 5)).toMatchObject({
                    isValid: false,
                    value: 5,
                    max: 2,
                    message: 'Must be at most 2'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const maxValidator = max((context) => ({
                    max: context.max,
                    message: `Must be at most ${context.max}`
                }));

                expect(validate(maxValidator, 5, {max: 4})).toMatchObject({
                    isValid: false,
                    value: 5,
                    max: 4,
                    message: 'Must be at most 4'
                });
            });
        });

        describe('range', () => {
            it('as named props', () => {
                const between10and20 = range({
                    min: 10,
                    max: 20,
                    message: 'Must be between 10 and 20'
                });

                expect(validate(between10and20, 5)).toMatchObject({
                    isValid: false,
                    value: 5,
                    min: 10,
                    max: 20,
                    message: 'Must be between 10 and 20'
                });
            });

            it('as a function that resolves to have the named props', () => {
                const rangeValidator = range((context) => ({
                    min: context.min,
                    max: context.max,
                    message: `Must be between ${context.min} and ${context.max}`
                }));

                expect(validate(rangeValidator, 5, {min: 10, max: 20})).toMatchObject({
                    isValid: false,
                    value: 5,
                    min: 10,
                    max: 20,
                    message: 'Must be between 10 and 20'
                });
            });
        });

        describe('minLength', () => {
            it('as a value param', () => {
                const minLengthOf3 = minLength(3);

                expect(validate(minLengthOf3, '12')).toMatchObject({
                    minLength: 3,
                    isValid: false
                });
            });

            it('as a named prop', () => {
                const minLengthOf2 = minLength({
                    minLength: 2,
                    message: 'Must have a length of at least 2'
                });

                expect(validate(minLengthOf2, 'ABCDE')).toMatchObject({
                    isValid: true,
                    value: 'ABCDE',
                    minLength: 2,
                    message: 'Must have a length of at least 2'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const minLengthValidator = minLength((context) => ({
                    minLength: context.minLength,
                    message: `Must have a length of at least ${context.minLength}`
                }));

                expect(validate(minLengthValidator, 'ABCDE', {minLength: 4})).toMatchObject({
                    isValid: true,
                    value: 'ABCDE',
                    minLength: 4,
                    message: 'Must have a length of at least 4'
                });
            });
        });

        describe('maxLength', () => {
            it('as a value param', () => {
                const maxLengthOf3 = maxLength(3);

                expect(validate(maxLengthOf3, '1234')).toMatchObject({
                    maxLength: 3,
                    isValid: false
                });
            });

            it('as a named prop', () => {
                const maxLengthOf2 = maxLength({
                    maxLength: 2,
                    message: 'Must have a length of at most 2'
                });

                expect(validate(maxLengthOf2, 'ABCDE')).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    maxLength: 2,
                    message: 'Must have a length of at most 2'
                });
            });

            it('as a function that resolves to have the named prop', () => {
                const maxLengthValidator = maxLength((context) => ({
                    maxLength: context.maxLength,
                    message: `Must have a length of at most ${context.maxLength}`
                }));

                expect(validate(maxLengthValidator, 'ABCDE', {maxLength: 4})).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    maxLength: 4,
                    message: 'Must have a length of at most 4'
                });
            });
        });

        describe('length', () => {
            it('as named props', () => {
                const maxLengthBetween10and20 = length({
                    minLength: 10,
                    maxLength: 20,
                    message: 'Must have a length between 10 and 20'
                });

                expect(validate(maxLengthBetween10and20, 'ABCDE')).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    minLength: 10,
                    maxLength: 20,
                    message: 'Must have a length between 10 and 20'
                });
            });

            it('as a function that resolves to have the named props', () => {
                const lengthValidator = length((context) => ({
                    minLength: context.minLength,
                    maxLength: context.maxLength,
                    message: `Must have a length between ${context.minLength} and ${context.maxLength}`
                }));

                expect(validate(lengthValidator, 'ABCDE', {minLength: 10, maxLength: 20})).toMatchObject({
                    isValid: false,
                    value: 'ABCDE',
                    minLength: 10,
                    maxLength: 20,
                    message: 'Must have a length between 10 and 20'
                });
            });
        });
    });
});
