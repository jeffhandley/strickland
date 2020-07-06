import formatResult from '../src/formatResult';

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

    describe('can be used for objectProps', () => {
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

        it('applying the formatter', () => {
            expect(result).toMatchObject({
                isValid: false,
                value: expect.objectContaining({name: 'ABC'}),
                formatted: true
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
    });
});
