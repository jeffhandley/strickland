import withMiddleware from '../src/withMiddleware';

describe('withMiddleware', () => {
    it('is a function', () => {
        expect(withMiddleware).toBeInstanceOf(Function);
    });

    describe('returns a function', () => {
        it('for performing validation', () => {
            expect(withMiddleware()).toBeInstanceOf(Function);
        });

        describe('that calls the wrapped validator', () => {
            const validate = jest.fn();

            const validateWithMiddleware = withMiddleware(validate, {
                middlewareFunction: 'middleware'
            });

            validateWithMiddleware('ABC', {contextProp: 'propValue'});

            it('passing the value', () => {
                expect(validate).toHaveBeenCalledWith(
                    'ABC',
                    expect.anything()
                );
            });

            it('passing the validation context', () => {
                expect(validate).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({
                        contextProp: 'propValue'
                    })
                );
            });

            it('passing the supplied middleware', () => {
                expect(validate).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({
                        middleware: expect.objectContaining({
                            middlewareFunction: 'middleware'
                        })
                    })
                );
            });
        });

        it('prepends middleware in the context', () => {
            const validate = jest.fn();

            const validateWithMiddleware = withMiddleware(validate, {
                middlewareFunction: 'middleware'
            });

            validateWithMiddleware('ABC', {middleware: {contextMiddleware: 'from context'}});

            expect(validate).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    middleware: [
                        expect.objectContaining({middlewareFunction: 'middleware'}),
                        expect.objectContaining({contextMiddleware: 'from context'})
                    ]
                })
            );
        });
    });

    describe('can be used for objectProps', () => {
        const validateName = jest.fn(() => false);
        const reduceResults = jest.fn((accumulator) => accumulator);
        const prepareResult = jest.fn();

        const middleware = {
            reduceResults,
            prepareResult
        };

        const validate = withMiddleware({
            name: validateName
        }, middleware);

        validate({name: 'ABC'});

        it('calling the reduceResults middleware', () => {
            expect(reduceResults).toHaveBeenCalledWith(
                // accumulator
                expect.objectContaining({
                    isValid: false,
                    objectProps: expect.objectContaining({})
                }),

                // currentResult
                expect.objectContaining({
                    objectProps: expect.objectContaining({
                        name: expect.objectContaining({
                            isValid: false,
                            value: 'ABC'
                        })
                    })
                }),

                // middleware context
                expect.any(Object)
            );
        });

        it('calling the prepareResult middleware', () => {
            expect(prepareResult).toHaveBeenCalledWith(
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
                expect.any(Object)
            );
        });
    });
});
