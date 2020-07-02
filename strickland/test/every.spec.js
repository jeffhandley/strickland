import {every, required, minLength, maxLength} from '../src/strickland';

describe('every', () => {
    describe('throws', () => {
        it('when no validators are specified', () => {
            expect(() => every()).toThrow();
        });

        it('when validators is a function', () => {
            expect(() => every(() => true)).toThrow();
        });
    });

    it('returns a validate function', () => {
        const validate = every([]);
        expect(validate).toBeInstanceOf(Function);
    });

    it('defaults to valid when validators is empty', () => {
        const validate = every([]);
        const result = validate();
        expect(result.isValid).toBe(true);
    });

    describe('validates', () => {
        const validate = every([
            required({message: 'Required'}),
            minLength(2),
            maxLength(4)
        ], {validatorProp: 'Validator message'});

        const value = 'A';
        const result = validate(value);

        it('returning a result object', () => {
            expect(result).toBeInstanceOf(Object);
        });

        it('returning an every array on the result', () => {
            expect(result.every).toBeInstanceOf(Array);
        });

        it('returning results for all valid validators and the first invalid validator', () => {
            expect(result).toMatchObject({
                every: [
                    {isValid: true, message: 'Required'},
                    {isValid: false, minLength: 2}
                ]
            });
        });

        it('returning a top-level isValid property', () => {
            expect(result.isValid).toBe(false);
        });

        it('producing valid results', () => {
            const validResult = validate('ABC');
            expect(validResult).toMatchObject({
                isValid: true,
                every: [
                    {isValid: true, message: 'Required'},
                    {isValid: true, minLength: 2},
                    {isValid: true, maxLength: 4}
                ]
            });
        });

        it('putting validator props on the result', () => {
            expect(result).toMatchObject({validatorProp: 'Validator message'});
        });

        it('resolving validator props from a function', () => {
            const getProps = jest.fn();
            const context = {contextProp: 'context'};
            every([], getProps)(null, context);

            expect(getProps).toHaveBeenCalledWith(context);
        });
    });

    describe('with nested rules arrays', () => {
        const validate = every([
            required({message: 'Required'}),
            [
                minLength(2),
                maxLength(4)
            ]
        ]);

        it('returns results in the shape of the rules', () => {
            const result = validate('ABC');

            expect(result).toMatchObject({
                every: [
                    {isValid: true, message: 'Required'},
                    {
                        isValid: true,
                        every: [
                            {isValid: true, minLength: 2},
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
                    isValid: true
                });
            }

            const validateWithResultProps = every([
                resultPropValidator({first: 'First'}),
                resultPropValidator({second: 'Second'}),
                every([
                    resultPropValidator({third: 'Third'}),
                    resultPropValidator({fourth: 'Fourth'}),
                    every([
                        resultPropValidator({fifth: 'Fifth'})
                    ])
                ])
            ]);

            const result = validateWithResultProps();

            expect(result).toMatchObject({
                isValid: true,
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
        const validate = every([validator], {validatorProp: 'Validator message'});

        validate('AB', {contextProp: 'Context message'});

        expect(validator).toHaveBeenCalledWith('AB', expect.objectContaining({
            contextProp: 'Context message'
        }));
    });

    describe('given async validators', () => {
        describe('returns a validateAsync function', () => {
            it('that returns a Promise', () => {
                const validate = every([
                    () => Promise.resolve(true)
                ]);

                const result = validate();
                expect(result.validateAsync()).toBeInstanceOf(Promise);
            });

            it('with exclusively nested results', () => {
                const validateNested = every([
                    every([
                        () => Promise.resolve(true)
                    ])
                ]);

                const nestedResult = validateNested('ABC');

                return expect(nestedResult.validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    every: [
                        {
                            isValid: true,
                            every: [{isValid: true}]
                        }
                    ]
                });
            });
        });

        describe('resolves results', () => {
            it('until an invalid result is encountered', () => {
                const validate = every([
                    () => ({isValid: true, first: 'First'}),
                    () => Promise.resolve({isValid: true, second: 'Second'}),
                    () => ({isValid: true, third: 'Third'}),
                    () => Promise.resolve({isValid: false, fourth: 'Fourth'}),
                    () => Promise.resolve({isValid: true, fifth: 'Fifth'})
                ]);

                const result = validate(null);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    first: 'First',
                    second: 'Second',
                    third: 'Third',
                    fourth: 'Fourth'
                });
            });

            it('but does not execute validators after the first invalid result', () => {
                const validate = every([
                    () => ({isValid: true, first: 'First'}),
                    () => Promise.resolve({isValid: true, second: 'Second'}),
                    () => ({isValid: true, third: 'Third'}),
                    () => Promise.resolve({isValid: false, fourth: 'Fourth'}),
                    () => Promise.resolve({isValid: true, fifth: 'Fifth'})
                ]);

                const result = validate();

                return expect(result.validateAsync()).resolves.not.toHaveProperty('fifth');
            });

            it('that resolve as true', () => {
                const validate = every([
                    () => Promise.resolve(true)
                ]);

                const result = validate();
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as a valid result object', () => {
                const validate = every([
                    () => Promise.resolve({isValid: true})
                ]);

                const result = validate();
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as false', () => {
                const validate = every([
                    () => Promise.resolve(false)
                ]);

                const result = validate();
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: false});
            });

            it('that resolve as an invalid result object', () => {
                const validate = every([
                    () => Promise.resolve({isValid: false})
                ]);

                const result = validate();
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: false});
            });

            it('recursively', () => {
                const validate = every([
                    () => Promise.resolve(
                        Promise.resolve(
                            Promise.resolve({
                                isValid: true,
                                recursively: 'Yes!'
                            })
                        )
                    ),
                    every([
                        () => Promise.resolve(
                            Promise.resolve(true)
                        ),
                        every([
                            () => Promise.resolve(
                                Promise.resolve({
                                    isValid: true,
                                    inNestedValidators: 'Yep'
                                })
                            )
                        ])
                    ])
                ]);

                const result = validate();

                return expect(result.validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    recursively: 'Yes!',
                    inNestedValidators: 'Yep'
                });
            });

            it('puts the value on the resolved result', () => {
                const validate = every([
                    () => Promise.resolve(true)
                ]);

                const result = validate('ABC');
                return expect(result.validateAsync()).resolves.toMatchObject({value: 'ABC'});
            });

            it('puts validator props on the resolved result', () => {
                const validate = every([
                    () => Promise.resolve(true)
                ], {validatorProp: 'Validator message'});

                const result = validate('ABC');
                return expect(result.validateAsync()).resolves.toMatchObject({validatorProp: 'Validator message'});
            });

            it('does not put context props on the resolved result', () => {
                const validate = every([
                    () => Promise.resolve(true)
                ]);

                const result = validate('ABC', {message: 'Message'});
                return expect(result.validateAsync()).resolves.not.toHaveProperty('message');
            });
        });

        describe('returns a partial result object', () => {
            const validate = every([
                () => ({isValid: true, first: 'First'}),
                () => ({isValid: true, second: 'Second'}),
                every([
                    () => ({isValid: true, third: 'Third'}),
                    () => ({
                        fourth: 'Not yet resolved',
                        validateAsync: Promise.resolve({isValid: true, fourth: 'Fourth'})
                    }),
                    () => ({isValid: true, fifth: 'Fifth'})
                ]),
                () => ({isValid: true, sixth: 'Sixth'})
            ]);

            const result = validate('ABC');

            it('that is marked as not valid', () => {
                expect(result.isValid).toBe(false);
            });

            it('with sync results in place and async results where expected', () => {
                expect(result).toMatchObject({
                    first: 'First',
                    second: 'Second',
                    third: 'Third',
                    fourth: 'Not yet resolved',
                    every: [
                        {first: 'First'},
                        {second: 'Second'},
                        {
                            third: 'Third',
                            fourth: 'Not yet resolved',
                            every: [
                                {third: 'Third'},
                                {validateAsync: expect.any(Function)}
                            ]
                        }
                    ]
                });
            });

            it('with individual validator promises that will finish their results', () => {
                return expect(result.every[2].every[1].validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    fourth: 'Fourth'
                });
            });
        });
    });

    describe('supports middleware', () => {
        describe('from validator props', () => {
            it('omitting the middleware validator prop from the result', () => {
                const middleware = {};

                const validate = every([], {middleware});
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

                    const validate = every([], props);
                    validate('ABC', context);

                    expect(middleware.prepareResult).toHaveBeenCalledWith(
                        // core prepareResult function
                        expect.any(Function),

                        // result
                        expect.objectContaining({
                            isValid: true,
                            every: []
                        }),
                        {
                            value: 'ABC',
                            props: expect.objectContaining({
                                testProp: 'propValue'
                            }),
                            context
                        }
                    );
                });

                it('allowing the core prepareResult function to be bypassed, omitting the every result prop', () => {
                    const middleware = {
                        prepareResult: () => ({})
                    };

                    const validate = every([], {middleware});
                    const result = validate('ABC');

                    expect(result).not.toHaveProperty('every');
                });

                it('allowing the core prepareResult function to be called before returning the result', () => {
                    const middleware = {
                        prepareResult(prepareResultCore, result) {
                            const coreResult = prepareResultCore(result);

                            return {
                                ...coreResult,
                                repeatedEvery: coreResult.every
                            };
                        }
                    };

                    const validate = every([required()], {middleware});
                    const result = validate('ABC');

                    expect(result).toMatchObject({
                        isValid: true,
                        every: [
                            expect.objectContaining({
                                isValid: true,
                                required: true,
                                value: 'ABC'
                            })
                        ],
                        repeatedEvery: [
                            expect.objectContaining({
                                isValid: true,
                                required: true,
                                value: 'ABC'
                            })
                        ]
                    });
                });

                describe('allowing the core prepareResult function to be called with a different result object', () => {
                    const middleware = {
                        prepareResult(prepareResultCore, result) {
                            return prepareResultCore({different: 'result object'});
                        }
                    };

                    const validate = every([required()], {middleware, validatorProp: 'validator prop'});
                    const result = validate('ABC');

                    it('while still merging that result and the validator props onto the final result', () => {
                        expect(result).toMatchObject({
                            different: 'result object',
                            validatorProp: 'validator prop'
                        });
                    });

                    it('but omitting original result props (every)', () => {
                        expect(result).not.toHaveProperty('every');
                    });
                });

                describe('allowing the isValid result prop to be overridden', () => {
                    it('forcing it to false', () => {
                        const middleware = {
                            prepareResult: () => ({isValid: false})
                        };

                        const validate = every([], {middleware});
                        const result = validate();

                        expect(result.isValid).toBe(false);
                    });

                    it('forcing it to be true', () => {
                        const middleware = {
                            prepareResult: () => ({isValid: true})
                        };

                        const validate = every([required()], {middleware});
                        const result = validate();

                        expect(result.isValid).toBe(true);
                    });
                });

                it('supporting the scenario of adding a `validationErrors` result prop', () => {
                    const middleware = {
                        prepareResult(innerPrepareResult, coreResult) {
                            const result = innerPrepareResult(coreResult);

                            return {
                                ...result,
                                validationErrors: result.every.filter(({isValid}) => !isValid)
                            };
                        }
                    };

                    const validate = every([required(), minLength(1), maxLength(2)], {middleware});
                    const result = validate('ABC');

                    expect(result).toMatchObject({
                        isValid: false,
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

                    const validate = every([required()], props);
                    validate('ABC', context);

                    expect(middleware.reduceResults).toHaveBeenCalledWith(
                        // next reduceResult function
                        expect.any(Function),

                        // previous result
                        expect.objectContaining({
                            isValid: true,
                            every: []
                        }),

                        // next result
                        expect.objectContaining({
                            isValid: true,
                            required: true
                        }),

                        {
                            value: 'ABC',
                            props: expect.objectContaining({
                                testProp: 'propValue'
                            }),
                            context
                        }
                    );
                });

                it('allowing the core reduceResults function to be bypassed, therefore not populating the every result prop', () => {
                    const middleware = {
                        reduceResults(nextReducer, previousResult, nextResult) {
                            return {
                                ...previousResult,
                                ...nextResult
                            };
                        }
                    };

                    const validate = every([required()], {middleware});
                    const result = validate('ABC');

                    expect(result.every).toHaveLength(0);
                });

                it('allowing the core reduceResults function to be called before returning the result', () => {
                    const middleware = {
                        reduceResults(nextReducer, previousResult, nextResult) {
                            const coreResult = nextReducer(previousResult, nextResult);

                            return {
                                ...coreResult,
                                every: [
                                    ...coreResult.every,
                                    {
                                        extraResult: true
                                    }
                                ]
                            };
                        }
                    };

                    const validate = every([required()], {middleware});
                    const result = validate('ABC');

                    expect(result).toMatchObject({
                        isValid: true,
                        every: [
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

                describe('allowing the core reduceResults function to be called with different result objects', () => {
                    const middleware = {
                        reduceResults(nextReducer, previousResult, nextResult) {
                            return nextReducer(
                                {
                                    ...previousResult,
                                    previousResult: 'replaced previous'
                                },
                                {
                                    ...nextResult,
                                    nextResult: 'replaced next'
                                }
                            );
                        }
                    };

                    const validate = every([required()], {middleware});
                    const result = validate('ABC');

                    it('while still merging that the supplied result objects', () => {
                        expect(result).toMatchObject({
                            isValid: true,
                            previousResult: 'replaced previous',
                            nextResult: 'replaced next'
                        });
                    });

                    it('and still adding the next result to the `every` result prop array', () => {
                        expect(result.every).toEqual([
                            expect.objectContaining({
                                isValid: true,
                                nextResult: 'replaced next'
                            })
                        ]);
                    });

                    it('guarding against the failure to include the `every` prop on the previous result', () => {
                        const badMiddleware = {
                            reduceResults(nextReducer, previousResult, nextResult) {
                                return nextReducer(
                                    {
                                        previousResult: 'replaced previous'
                                    },
                                    {
                                        nextResult: 'replaced next'
                                    }
                                );
                            }
                        };

                        const validate = every([required(), minLength(1)], {middleware: badMiddleware});
                        const result = validate('ABC');

                        expect(result).toMatchObject({
                            previousResult: 'replaced previous',
                            nextResult: 'replaced next',
                            every: [
                                expect.objectContaining({
                                    nextResult: 'replaced next'
                                })
                            ]
                        });
                    });

                    it('guarding against the failure to include the `isValid` result props (defaulting to false)', () => {
                        const badMiddleware = {
                            reduceResults(nextReducer, previousResult, nextResult) {
                                return nextReducer(
                                    {
                                        previousResult: 'replaced previous'
                                    },
                                    {
                                        nextResult: 'replaced next'
                                    }
                                );
                            }
                        };

                        const validate = every([required(), minLength(1)], {middleware: badMiddleware});
                        const result = validate('ABC');

                        expect(result).toMatchObject({
                            previousResult: 'replaced previous',
                            nextResult: 'replaced next',
                            isValid: false
                        });
                    });
                });

                describe('allowing the isValid result prop to be overridden', () => {
                    it('forcing it to false', () => {
                        const middleware = {
                            reduceResults(nextReducer, previousResult, nextResult) {
                                return {
                                    ...nextReducer(previousResult, nextResult),
                                    isValid: false
                                };
                            }
                        };

                        const validate = every([required()], {middleware});
                        const result = validate('ABC');

                        expect(result.isValid).toBe(false);
                    });

                    it('forcing it to be true', () => {
                        const middleware = {
                            reduceResults(nextReducer, previousResult, nextResult) {
                                return {
                                    ...nextReducer(previousResult, nextResult),
                                    isValid: true
                                };
                            }
                        };

                        const validate = every([required()], {middleware});
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

                const validate = every([]);
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

                const validate = every([required()]);
                const result = validate(null, {middleware});

                expect(result).toMatchObject({
                    fromContextMiddleware: true
                });
            });
        });

        describe('from validator props and validation context together, still calling the core prepareResult function', () => {
            it('for prepareResult', () => {
                const propsMiddleware = {
                    prepareResult(innerPrepareResult, coreResult) {
                        const result = innerPrepareResult(coreResult);

                        return {
                            ...result,
                            fromPropsMiddleware: 1
                        };
                    }
                };

                const contextMiddleware = {
                    prepareResult(innerPrepareResult, coreResult) {
                        const result = innerPrepareResult(coreResult);

                        return {
                            ...result,
                            fromContextMiddleware: result.fromPropsMiddleware + 2
                        };
                    }
                };

                const validate = every([required()], {middleware: propsMiddleware});
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
                    reduceResults(nextReducer, previousResult, nextResult) {
                        const result = nextReducer(previousResult, nextResult);

                        return {
                            ...result,
                            fromPropsMiddleware: 1
                        };
                    }
                };

                const contextMiddleware = {
                    reduceResults(nextReducer, previousResult, nextResult) {
                        const result = nextReducer(previousResult, nextResult);

                        return {
                            ...result,
                            fromContextMiddleware: result.fromPropsMiddleware + 2
                        };
                    }
                };

                const validate = every([required()], {middleware: propsMiddleware});
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
            const addFromPrepareResult = (innerPrepareResult, result) => ({
                ...result,
                fromPrepareResult: (innerPrepareResult(result).fromPrepareResult || 0) + 1
            });

            const addFromReduceResults = (nextReducer, previousResult, nextResult) => ({
                fromReduceResults: (nextReducer(previousResult, nextResult).fromReduceResults || 0) + 2
            });

            const middleware = {
                prepareResult: addFromPrepareResult,
                reduceResults: addFromReduceResults
            };

            const validate = every([required()], {middleware: [middleware, middleware]});
            const result = validate(null, {middleware: [middleware, middleware, middleware]});

            expect(result).toMatchObject({
                fromPrepareResult: 5,
                fromReduceResults: 10
            });
        });
    });
});
