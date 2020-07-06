import {some, required, minLength, maxLength} from '../src/strickland';

describe('some', () => {
    describe('throws', () => {
        it('when no validators are specified', () => {
            expect(() => some()).toThrow();
        });

        it('when validators is a function', () => {
            expect(() => some(() => true)).toThrow();
        });
    });

    it('returns a validate function', () => {
        const validate = some([]);
        expect(validate).toBeInstanceOf(Function);
    });

    it('defaults to valid when validators is empty', () => {
        const validate = some([]);
        const result = validate();
        expect(result.isValid).toBe(true);
    });

    describe('validates', () => {
        const validate = some([
            required({message: 'Required'}),
            maxLength(4),
            minLength(2)
        ], {validatorProp: 'Validator message'});

        const value = '';
        const result = validate(value);

        it('returning a result object', () => {
            expect(result).toBeInstanceOf(Object);
        });

        it('returning a some array on the result', () => {
            expect(result.some).toBeInstanceOf(Array);
        });

        it('returning results for invalid validators and the first valid validator', () => {
            expect(result.some[0]).toMatchObject({isValid: false, message: 'Required'});
            expect(result.some[1]).toMatchObject({isValid: true, maxLength: 4});
        });

        it('returning a top-level isValid property (true when any result is valid)', () => {
            expect(result.isValid).toBe(true);
        });

        it('producing valid results', () => {
            const validResult = validate('ABC');
            expect(validResult).toMatchObject({
                isValid: true,
                some: [
                    {isValid: true, message: 'Required'}
                ]
            });
        });

        it('putting validator props on the result', () => {
            expect(result).toMatchObject({validatorProp: 'Validator message'});
        });

        it('resolving validator props from a function', () => {
            const getProps = jest.fn();
            const context = {contextProp: 'context'};
            some([], getProps)(null, context);

            expect(getProps).toHaveBeenCalledWith(context);
        });
    });

    describe('with nested rules arrays', () => {
        const validate = some([
            some([
                minLength(2),
                maxLength(4)
            ])
        ]);

        it('returns results in the shape of the rules', () => {
            const result = validate('A');

            expect(result).toMatchObject({
                some: [
                    {
                        isValid: true,
                        some: [
                            {isValid: false, minLength: 2},
                            {isValid: true, maxLength: 4}
                        ]
                    }
                ]
            });
        });

        it('flattens result props onto the top-level result', () => {
            function resultPropValidator(props) {
                return () => ({
                    ...props,
                    isValid: false
                });
            }

            const validateWithResultProps = some([
                resultPropValidator({first: 'First'}),
                resultPropValidator({second: 'Second'}),
                some([
                    resultPropValidator({third: 'Third'}),
                    resultPropValidator({fourth: 'Fourth'}),
                    some([
                        resultPropValidator({fifth: 'Fifth'})
                    ])
                ])
            ]);

            const result = validateWithResultProps();

            expect(result).toMatchObject({
                isValid: false,
                first: 'First',
                second: 'Second',
                third: 'Third',
                fourth: 'Fourth',
                fifth: 'Fifth'
            });
        });
    });

    it('passes context to the validators', () => {
        const validator = jest.fn();
        const validate = some([validator], {validatorProp: 'Validator message'});

        validate('AB', {contextProp: 'Context message'});

        expect(validator).toHaveBeenCalledWith('AB', expect.objectContaining({
            contextProp: 'Context message'
        }));
    });

    describe('given async validators', () => {
        describe('returns a validateAsync function', () => {
            it('that returns a Promise', () => {
                const validate = some([
                    () => Promise.resolve(true)
                ]);

                const result = validate();
                expect(result.validateAsync()).toBeInstanceOf(Promise);
            });

            it('with exclusively nested results', () => {
                const validateNested = some([
                    some([
                        () => Promise.resolve(true)
                    ])
                ]);

                const nestedResult = validateNested('ABC');

                return expect(nestedResult.validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    some: [
                        {
                            isValid: true,
                            some: [{isValid: true}]
                        }
                    ]
                });
            });
        });

        describe('resolves results', () => {
            it('until a valid result is encountered', () => {
                const validate = some([
                    () => ({isValid: false, first: 'First'}),
                    () => Promise.resolve({isValid: false, second: 'Second'}),
                    () => ({isValid: false, third: 'Third'}),
                    () => Promise.resolve({isValid: true, fourth: 'Fourth'}),
                    () => Promise.resolve({isValid: false, fifth: 'Fifth'})
                ]);

                const result = validate(null);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    first: 'First',
                    second: 'Second',
                    third: 'Third',
                    fourth: 'Fourth'
                });
            });

            it('but does not execute validators after the first valid result', () => {
                const validate = some([
                    () => ({isValid: false, first: 'First'}),
                    () => Promise.resolve({isValid: false, second: 'Second'}),
                    () => ({isValid: false, third: 'Third'}),
                    () => Promise.resolve({isValid: true, fourth: 'Fourth'}),
                    () => Promise.resolve({isValid: false, fifth: 'Fifth'})
                ]);

                const result = validate();

                return expect(result.validateAsync()).resolves.not.toHaveProperty('fifth');
            });

            it('that resolve as true', () => {
                const validate = some([
                    () => Promise.resolve(true)
                ]);

                const result = validate();
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as a valid result object', () => {
                const validate = some([
                    () => Promise.resolve({isValid: true})
                ]);

                const result = validate();
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as false', () => {
                const validate = some([
                    () => Promise.resolve(false)
                ]);

                const result = validate();
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: false});
            });

            it('that resolve as an invalid result object', () => {
                const validate = some([
                    () => Promise.resolve({isValid: false})
                ]);

                const result = validate();
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: false});
            });

            it('recursively', () => {
                const validate = some([
                    () => Promise.resolve(
                        Promise.resolve(
                            Promise.resolve({
                                isValid: false,
                                recursively: 'Yes!'
                            })
                        )
                    ),
                    some([
                        () => Promise.resolve(
                            Promise.resolve(false)
                        ),
                        some([
                            () => Promise.resolve(
                                Promise.resolve({
                                    isValid: false,
                                    inNestedValidators: 'Yep'
                                })
                            )
                        ])
                    ])
                ]);

                const result = validate();

                return expect(result.validateAsync()).resolves.toMatchObject({
                    isValid: false,
                    recursively: 'Yes!',
                    inNestedValidators: 'Yep'
                });
            });

            it('puts the value on the resolved result', () => {
                const validate = some([
                    () => Promise.resolve(true)
                ]);

                const result = validate('ABC');
                return expect(result.validateAsync()).resolves.toMatchObject({value: 'ABC'});
            });

            it('puts validator props on the resolved result', () => {
                const validate = some([
                    () => Promise.resolve(true)
                ], {validatorProp: 'Validator message'});

                const result = validate('ABC');
                return expect(result.validateAsync()).resolves.toMatchObject({validatorProp: 'Validator message'});
            });

            it('does not put context props on the resolved result', () => {
                const validate = some([
                    () => Promise.resolve(true)
                ]);

                const result = validate('ABC', {message: 'Message'});
                return expect(result.validateAsync()).resolves.not.toHaveProperty('message');
            });
        });

        describe('returns a partial result object', () => {
            const validate = some([
                () => ({isValid: false, first: 'First'}),
                () => ({isValid: false, second: 'Second'}),
                some([
                    () => ({isValid: false, third: 'Third'}),
                    () => ({
                        fourth: 'Not yet resolved',
                        validateAsync: Promise.resolve({isValid: false, fourth: 'Fourth'})
                    }),
                    () => ({isValid: false, fifth: 'Fifth'})
                ]),
                () => ({isValid: false, sixth: 'Sixth'})
            ]);

            const result = validate('ABC');

            it('that is marked as not valid', () => {
                expect(result.isValid).toBe(false);
            });

            it('with sync results in place and Promise results where expected', () => {
                expect(result).toMatchObject({
                    first: 'First',
                    second: 'Second',
                    third: 'Third',
                    fourth: 'Not yet resolved',
                    some: [
                        {first: 'First'},
                        {second: 'Second'},
                        {
                            third: 'Third',
                            fourth: 'Not yet resolved',
                            some: [
                                {third: 'Third'},
                                {validateAsync: expect.any(Function)}
                            ]
                        }
                    ]
                });
            });

            it('with individual validator promises that will finish their results', () => {
                return expect(result.some[2].some[1].validateAsync()).resolves.toMatchObject({
                    isValid: false,
                    fourth: 'Fourth'
                });
            });
        });
    });

    describe('supports middleware', () => {
        describe('from validator props', () => {
            it('omitting the middleware validator prop from the result', () => {
                const middleware = {};

                const validate = some([], {middleware});
                const result = validate('ABC');

                expect(result).not.toHaveProperty('middleware');
            });

            describe('for prepareResult', () => {
                it('calling the middleware function with the expected args', () => {
                    const middleware = {
                        prepareResult: jest.fn()
                    };

                    const props = {
                        middleware,
                        testProp: 'propValue'
                    };

                    const context = {
                        contextProp: 'contextValue'
                    };

                    const validate = some([], props);
                    validate('ABC', context);

                    expect(middleware.prepareResult).toHaveBeenCalledWith(
                        // result
                        expect.objectContaining({
                            isValid: true,
                            some: [],
                            testProp: 'propValue'
                        }),

                        // middleware context
                        {
                            value: 'ABC',
                            props: expect.objectContaining({
                                testProp: 'propValue'
                            }),
                            context,
                            validatorResult: expect.objectContaining({
                                isValid: true,
                                some: []
                            })
                        }
                    );
                });

                it('allowing the prepared result to be overridden, omitting the `some` result prop', () => {
                    const middleware = {
                        prepareResult: () => ({})
                    };

                    const validate = some([], {middleware});
                    const result = validate('ABC');

                    expect(result).not.toHaveProperty('some');
                });

                it('allowing the result to be augmented', () => {
                    const middleware = {
                        prepareResult: (result) => ({
                            ...result,
                            repeatedSome: result.some
                        })
                    };

                    const validate = some([required()], {middleware});
                    const result = validate('ABC');

                    expect(result).toMatchObject({
                        isValid: true,
                        some: [
                            expect.objectContaining({
                                isValid: true,
                                required: true,
                                value: 'ABC'
                            })
                        ],
                        repeatedSome: [
                            expect.objectContaining({
                                isValid: true,
                                required: true,
                                value: 'ABC'
                            })
                        ]
                    });
                });

                describe('allowing the `validatorResult` to be used instead of the core prepared result', () => {
                    const middleware = {
                        prepareResult: (result, { validatorResult }) => ({
                            ...validatorResult,
                            different: 'result object'
                        })
                    };

                    const validate = some([required()], {middleware, validatorProp: 'validator prop'});
                    const result = validate('ABC');

                    it('while still merging that result and the validator props onto the final result', () => {
                        expect(result).toMatchObject({
                            different: 'result object',
                            required: true
                        });
                    });

                    it('but omitting the validator props', () => {
                        expect(result).not.toHaveProperty('validatorProp');
                    });
                });

                describe('allowing the isValid result prop to be overridden', () => {
                    it('forcing it to false', () => {
                        const middleware = {
                            prepareResult: () => ({isValid: false})
                        };

                        const validate = some([], {middleware});
                        const result = validate();

                        expect(result.isValid).toBe(false);
                    });

                    it('forcing it to be true', () => {
                        const middleware = {
                            prepareResult: () => ({isValid: true})
                        };

                        const validate = some([required()], {middleware});
                        const result = validate();

                        expect(result.isValid).toBe(true);
                    });
                });

                it('supporting the scenario of adding a `validationErrors` result prop', () => {
                    const middleware = {
                        prepareResult: (result) => ({
                            ...result,
                            validationErrors: result.some.filter(({isValid}) => !isValid)
                        })
                    };

                    const validate = some([maxLength(2), minLength(1), required()], {middleware});
                    const result = validate('ABC');

                    expect(result).toMatchObject({
                        isValid: true,
                        validationErrors: [
                            expect.objectContaining({
                                maxLength: 2,
                                length: 3
                            })
                        ]
                    });
                });
            });

            describe('for reduceResults', () => {
                it('calling the middleware function with the expected args', () => {
                    const middleware = {
                        reduceResults: jest.fn()
                    };

                    const props = {
                        middleware,
                        testProp: 'propValue'
                    };

                    const context = {
                        contextProp: 'contextValue'
                    };

                    const validate = some([required()], props);
                    validate('ABC', context);

                    expect(middleware.reduceResults).toHaveBeenCalledWith(
                        // accumulator
                        expect.objectContaining({
                            isValid: true,
                            some: [
                                expect.objectContaining({
                                    isValid: true,
                                    required: true
                                })
                            ]
                        }),

                        // current result
                        expect.objectContaining({
                            isValid: true,
                            required: true
                        }),

                        // middleware context
                        {
                            value: 'ABC',
                            props: expect.objectContaining({
                                testProp: 'propValue'
                            }),
                            context,
                            previousResult: expect.objectContaining({
                                isValid: true,
                                some: []
                            })
                        }
                    );
                });

                it('allowing the previousResult to be used, bypassing previous reduceResults middleware, therefore not populating the `some` result prop', () => {
                    const middleware = {
                        reduceResults(accumulator, currentResult, { previousResult }) {
                            return {
                                ...previousResult,
                                ...currentResult
                            };
                        }
                    };

                    const validate = some([required()], {middleware});
                    const result = validate('ABC');

                    expect(result.some).toHaveLength(0);
                });

                it('allowing the reduced result to be augmented', () => {
                    const middleware = {
                        reduceResults: (accumulator, currentResult) => ({
                            ...accumulator,
                            some: [
                                ...accumulator.some,
                                {
                                    extraResult: true
                                }
                            ]
                        })
                    };

                    const validate = some([required()], {middleware});
                    const result = validate('ABC');

                    expect(result).toMatchObject({
                        isValid: true,
                        some: [
                            expect.objectContaining({
                                isValid: true,
                                required: true,
                                value: 'ABC'
                            }),
                            expect.objectContaining({
                                extraResult: true
                            })
                        ]
                    });
                });

                it('allowing the reduced result to be completely overridden', () => {
                    const middleware = {
                        reduceResults: (accumulator, currentResult) => ({
                            replaced: true
                        })
                    };

                    const validate = some([required()], {middleware});
                    const result = validate('ABC');

                    expect(result).toMatchObject({
                        replaced: true
                    });
                });

                it('guarding against the `some` prop getting dropped between validators', () => {
                    const middleware = {
                        reduceResults: (accumulator, currentResult) => ({
                            replaced: true
                        })
                    };

                    const validate = some([required(), minLength(1)], {middleware});

                    expect(() => validate('ABC')).not.toThrow();
                });

                describe('allowing the `isValid` result prop to be overridden', () => {
                    it('forcing it to false', () => {
                        const middleware = {
                            reduceResults: (accumulator, currentResult) => ({
                                ...accumulator,
                                isValid: false
                            })
                        };

                        const validate = some([required()], {middleware});
                        const result = validate('ABC');

                        expect(result.isValid).toBe(false);
                    });

                    it('forcing it to be true', () => {
                        const middleware = {
                            reduceResults: (accumulator, currentResult) => ({
                                ...accumulator,
                                isValid: true
                            })
                        };

                        const validate = some([required()], {middleware});
                        const result = validate();

                        expect(result.isValid).toBe(true);
                    });
                });
            });
        });

        describe('from validation context', () => {
            it('for prepareResult', () => {
                const middleware = {
                    prepareResult: () => ({
                        fromContextMiddleware: true
                    })
                };

                const validate = some([]);
                const result = validate(null, {middleware});

                expect(result).toMatchObject({
                    fromContextMiddleware: true
                });
            });

            it('for reduceResults', () => {
                const middleware = {
                    reduceResults: () => ({
                        fromContextMiddleware: true
                    })
                };

                const validate = some([required()]);
                const result = validate(null, {middleware});

                expect(result).toMatchObject({
                    fromContextMiddleware: true
                });
            });
        });

        describe('from validator props and validation context together', () => {
            it('for prepareResult', () => {
                const propsMiddleware = {
                    prepareResult: (result) => ({
                        ...result,
                        fromPropsMiddleware: 1
                    })
                };

                const contextMiddleware = {
                    prepareResult: (result) => ({
                        ...result,
                        fromContextMiddleware: result.fromPropsMiddleware + 2
                    })
                };

                const validate = some([required()], {middleware: propsMiddleware});
                const result = validate(null, {middleware: contextMiddleware});

                expect(result).toMatchObject({
                    isValid: false,
                    required: true,
                    fromPropsMiddleware: 1,
                    fromContextMiddleware: 3
                });
            });

            it('for reduceResults', () => {
                const propsMiddleware = {
                    reduceResults: (accumulator, currentResult) => ({
                        ...accumulator,
                        fromPropsMiddleware: 1
                    })
                };

                const contextMiddleware = {
                    reduceResults: (accumulator, currentResult) => ({
                        ...accumulator,
                        fromContextMiddleware: accumulator.fromPropsMiddleware + 2
                    })
                };

                const validate = some([required()], {middleware: propsMiddleware});
                const result = validate(null, {middleware: contextMiddleware});

                expect(result).toMatchObject({
                    isValid: false,
                    required: true,
                    fromPropsMiddleware: 1,
                    fromContextMiddleware: 3
                });
            });
        });

        it('using arrays of middleware', () => {
            const addFromPrepareResult = (result) => ({
                ...result,
                fromPrepareResult: (result.fromPrepareResult || 0) + 1
            });

            const addFromReduceResults = (accumulator, currentResult) => ({
                fromReduceResults: (accumulator.fromReduceResults || 0) + 2
            });

            const middleware = {
                prepareResult: addFromPrepareResult,
                reduceResults: addFromReduceResults
            };

            const validate = some([required()], {middleware: [middleware, middleware]});
            const result = validate(null, {middleware: [middleware, middleware, middleware]});

            expect(result).toMatchObject({
                fromPrepareResult: 5,
                fromReduceResults: 10
            });
        });
    });
});
