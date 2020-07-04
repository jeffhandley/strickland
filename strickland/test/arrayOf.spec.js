import {arrayOf, required, minLength, maxLength} from '../src/strickland';

describe('arrayOf', () => {
    it('returns a validate function', () => {
        const validate = arrayOf(() => true);
        expect(validate).toBeInstanceOf(Function);
    });

    describe('validates', () => {
        describe('null values', () => {
            const validate = arrayOf(() => true);
            const result = validate(null);

            it('as valid', () => {
                expect(result.isValid).toBe(true);
            });

            it('with an empty `arrayOf` result prop', () => {
                expect(result.arrayOf).toEqual([]);
            });
        });

        describe('with a validator that always returns true', () => {
            const validate = arrayOf(() => true);
            const result = validate([]);

            it('returns valid results', () => {
                expect(result.isValid).toBe(true);
            });

            it('returns an empty `arrayOf` result prop', () => {
                expect(result.arrayOf).toEqual([]);
            });
        });

        describe('that the value is an array', () => {
            const validate = arrayOf(() => true);
            const result = validate('ABC');

            it('returns an invalid result', () => {
                expect(result.isValid).toBe(false);
            });

            it('returns an empty `arrayOf` result prop', () => {
                expect(result.arrayOf).toEqual([]);
            });
        });

        describe('all elements of the array', () => {
            const validate = arrayOf(required());
            const result = validate([
                0,
                1,
                false,
                true,
                null,
                '',
                'ABC'
            ]);

            expect(result).toMatchObject({
                isValid: false,
                arrayOf: [
                    expect.objectContaining({isValid: true}),
                    expect.objectContaining({isValid: true}),
                    expect.objectContaining({isValid: false}),
                    expect.objectContaining({isValid: true}),
                    expect.objectContaining({isValid: false}),
                    expect.objectContaining({isValid: false}),
                    expect.objectContaining({isValid: true}),
                ]
            });
        });

        it('with an array for rules', () => {
            const validate = arrayOf([required(), minLength(1)]);
            const result = validate(['ABC']);

            expect(result).toMatchObject({
                isValid: true,
                arrayOf: [
                    {
                        isValid: true,
                        required: true,
                        minLength: 1,
                        value: 'ABC'
                    }
                ]
            });
        });
    });

    describe('passes context to the validators', () => {
        const validator = jest.fn();

        const validate = arrayOf(validator);
        validate([true], {contextProp: 'Context prop'});

        it('from the validation context', () => {
            expect(validator).toHaveBeenCalledWith(true, expect.objectContaining({
                contextProp: 'Context prop'
            }));
        });
    });

    describe('allows context to be specified for individual elements', () => {
        const validator = jest.fn();
        const validate = arrayOf(validator);

        const context = {
            contextProp: 'Context prop',
            arrayOf: [{element: 'specific context'}]
        };

        validate([true], context);

        it('for top-level props', () => {
            expect(validator).toHaveBeenCalledWith(true, expect.objectContaining({
                contextProp: 'Context prop',
                element: 'specific context'
            }));
        });
    });

    describe('given async validators', () => {
        describe('returns a validateAsync function', () => {
            it('that returns a Promise', () => {
                const validate = arrayOf(() => Promise.resolve(true));
                const result = validate([true]);

                expect(result.validateAsync()).toBeInstanceOf(Promise);
            });
        });

        describe('resolves results', () => {
            it('resolves arrayOf result, without stopping at on invalid results', () => {
                const validate = arrayOf(() => Promise.resolve(false));
                const result = validate([1, 2, 3]);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    arrayOf: [
                        expect.objectContaining({isValid: false, value: 1}),
                        expect.objectContaining({isValid: false, value: 2}),
                        expect.objectContaining({isValid: false, value: 3})
                    ]
                });
            });

            it('that resolve as true', () => {
                const validate = arrayOf(() => Promise.resolve(true));
                const result = validate([true]);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    arrayOf: [
                        expect.objectContaining({
                            isValid: true,
                            value: true
                        })
                    ]
                });
            });

            it('that resolve as a valid result object', () => {
                const validate = arrayOf(() => Promise.resolve({isValid: true}));
                const result = validate([true]);

                return expect(result.validateAsync()).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as false', () => {
                const validate = arrayOf(() => Promise.resolve(false));
                const result = validate([true]);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    isValid: false,
                    arrayOf: [
                        expect.objectContaining({
                            isValid: false,
                            value: true
                        })
                    ]
                });
            });

            it('that resolve as an invalid result object', () => {
                const validate = arrayOf(() => Promise.resolve({isValid: false}));
                const result = validate([true]);

                return expect(result.validateAsync()).resolves.toMatchObject({isValid: false});
            });

            it('recursively', () => {
                const validate = arrayOf([
                    () => Promise.resolve(
                        Promise.resolve(
                            Promise.resolve({
                                isValid: true,
                                recursively: 'Yes!'
                            })
                        )
                    ),
                    arrayOf([
                        () => Promise.resolve(
                            Promise.resolve(true)
                        ),
                        arrayOf(
                            () => Promise.resolve(
                                Promise.resolve({
                                    isValid: true,
                                    inNestedValidators: 'Yep'
                                })
                            )
                        )
                    ])
                ]);

                const value = [
                    [
                        [
                            true
                        ]
                    ]
                ];

                const result = validate(value);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    arrayOf: [
                        expect.objectContaining({
                            isValid: true,
                            recursively: 'Yes!',
                            arrayOf: [
                                expect.objectContaining({
                                    isValid: true,
                                    arrayOf: [
                                        expect.objectContaining({
                                            isValid: true,
                                            inNestedValidators: 'Yep'
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                });
            });

            it('puts validator props on the resolved result', () => {
                const validate = arrayOf(
                    () => Promise.resolve(true),
                    {validatorProp: 'Validator message'}
                );

                const result = validate([true]);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    validatorProp: 'Validator message'
                });
            });

            it('does not put context props on the resolved result', () => {
                const validate = arrayOf(() => Promise.resolve(true));
                const result = validate([true], {message: 'Message'});

                return expect(result.validateAsync()).resolves.not.toHaveProperty('message');
            });
        });

        describe('returns a partial result object', () => {
            const validate = arrayOf((value) => {
                if (!value) {
                    return {isValid: true, async: false};
                }

                return () => Promise.resolve({isValid: true, async: true});
            });

            const result = validate([false, true]);

            it('that is marked as not valid', () => {
                expect(result.isValid).toBe(false);
            });

            it('with sync results in place and Promise results where expected', () => {
                expect(result).toMatchObject({
                    arrayOf: [
                        expect.objectContaining({
                            isValid: true,
                            async: false
                        }),
                        expect.objectContaining({
                            validateAsync: expect.any(Function)
                        })
                    ]
                });
            });

            it('with individual validator promises that will finish their results', () => {
                return expect(result.arrayOf[1].validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    async: true,
                    value: true
                });
            });
        });
    });
});
