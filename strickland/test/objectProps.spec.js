import {objectProps, required, minLength, maxLength, length, withMiddleware} from '../src/strickland';

describe('objectProps', () => {
    describe('throws', () => {
        it('with undefined rules', () => {
            expect(() => objectProps()).toThrow();
        });

        it('with null rules', () => {
            expect(() => objectProps(null)).toThrow();
        });

        it('with numeric rules', () => {
            expect(() => objectProps(1)).toThrow();
        });

        it('with string rules', () => {
            expect(() => objectProps('string')).toThrow();
        });

        it('with an array for rules', () => {
            expect(() => objectProps([{}])).toThrow();
        });

        it('with a function for rules', () => {
            expect(() => objectProps(required())).toThrow();
        });
    });

    it('returns a validate function', () => {
        const validate = objectProps({});
        expect(validate).toBeInstanceOf(Function);
    });

    describe('validates', () => {
        const personProps = {
            first: required({message: 'First: required'}),
            last: [
                required({message: 'Last: required'}),
                minLength({minLength: 2, message: 'Last: minLength'})
            ]
        };

        const validate = objectProps(personProps, {validatorProp: 'Validator message'});
        const person = {
            first: '',
            last: 'A'
        };

        const result = validate(person);

        it('returning a result object', () => {
            expect(result).toBeInstanceOf(Object);
        });

        it('returning results for all props', () => {
            expect(result).toMatchObject({
                objectProps: {
                    first: {isValid: false},
                    last: {isValid: false}
                }
            });
        });

        it('returning a top-level isValid property', () => {
            expect(result.isValid).toBeDefined();
        });

        it('producing invalid results', () => {
            expect(result.isValid).toBe(false);
        });

        it('producing valid results', () => {
            const validPerson = {
                first: 'A',
                last: 'AB'
            };

            const validResult = validate(validPerson);
            expect(validResult).toMatchObject({
                isValid: true,
                objectProps: {
                    first: {isValid: true},
                    last: {isValid: true}
                }
            });
        });

        it('putting validator props on the result', () => {
            expect(result).toMatchObject({validatorProp: 'Validator message'});
        });

        it('resolving validator props from a function', () => {
            const getProps = jest.fn();
            const context = {contextProp: 'context'};
            objectProps({}, getProps)(null, context);

            expect(getProps).toHaveBeenCalledWith(context);
        });
    });

    describe('with empty rules', () => {
        const validate = objectProps({});
        const result = validate({});

        it('returns valid results', () => {
            expect(result.isValid).toBe(true);
        });

        it('returns empty objectProps', () => {
            expect(result.objectProps).toEqual({});
        });
    });

    describe('with nested rules objects', () => {
        const validate = objectProps({
            name: required(),
            homeAddress: {
                street: required(),
                city: required(),
                state: [required(), length(2, 2)]
            },
            workAddress: {
                street: {
                    number: required(),
                    name: required()
                },
                city: required(),
                state: [required(), length(2, 2)]
            }
        });

        it('returns objectProps in the shape of the rules', () => {
            const value = {
                name: 'Name',
                homeAddress: {
                    street: '9303 Lyon Dr.',
                    city: 'Hill Valley',
                    state: 'CA'
                },
                workAddress: {
                    street: {
                        number: 456,
                        name: 'Front St.'
                    },
                    city: 'City',
                    state: 'ST'
                }
            };

            const result = validate(value);

            expect(result.objectProps).toMatchObject({
                name: {isValid: true},
                homeAddress: {
                    isValid: true,
                    objectProps: {
                        street: {isValid: true},
                        city: {isValid: true},
                        state: {isValid: true}
                    }
                },
                workAddress: {
                    isValid: true,
                    objectProps: {
                        street: {
                            isValid: true,
                            objectProps: {
                                number: {isValid: true},
                                name: {isValid: true}
                            }
                        },
                        city: {isValid: true},
                        state: {isValid: true}
                    }
                }
            });
        });

        it('returns valid results', () => {
            const value = {
                name: 'Name',
                homeAddress: {
                    street: '9303 Lyon Dr.',
                    city: 'Hill Valley',
                    state: 'CA'
                },
                workAddress: {
                    street: {
                        number: 456,
                        name: 'Front St.'
                    },
                    city: 'City',
                    state: 'ST'
                }
            };

            const result = validate(value);

            expect(result).toMatchObject({
                isValid: true,
                objectProps: {
                    homeAddress: {isValid: true},
                    workAddress: {
                        isValid: true,
                        objectProps: {
                            street: {isValid: true}
                        }
                    }
                }
            });
        });

        it('returns invalid results (validating all properties)', () => {
            const value = {
                name: '',
                homeAddress: {
                    street: '9303 Lyon Dr.',
                    city: 'Hill Valley',
                    state: ''
                },
                workAddress: {
                    street: {
                        number: '',
                        name: ''
                    },
                    city: '',
                    state: 'ST'
                }
            };

            const result = validate(value);

            expect(result).toMatchObject({
                isValid: false,
                objectProps: {
                    homeAddress: {
                        isValid: false
                    },
                    workAddress: {
                        isValid: false,
                        objectProps: {
                            street: {
                                isValid: false,
                                objectProps: {
                                    name: {isValid: false}
                                }
                            }
                        }
                    }
                }
            });
        });
    });

    describe('when properties are missing from the value', () => {
        const validate = objectProps({
            name: required(),
            homeAddress: {
                street: required(),
                city: required(),
                state: [required(), length(2, 2)]
            },
            workAddress: {
                street: {
                    number: required(),
                    name: required()
                },
                city: required(),
                state: [required(), length(2, 2)]
            }
        });

        it('validates missing scalar values', () => {
            const value = {
                homeAddress: {},
                workAddress: {
                    street: {}
                }
            };

            const result = validate(value);

            expect(result).toMatchObject({
                isValid: false,
                objectProps: {
                    name: {isValid: false},
                    homeAddress: {
                        isValid: false,
                        objectProps: {
                            street: {isValid: false},
                            city: {isValid: false},
                            state: {isValid: false}
                        }
                    },
                    workAddress: {
                        isValid: false,
                        objectProps: {
                            street: {
                                isValid: false,
                                objectProps: {
                                    number: {isValid: false},
                                    name: {isValid: false}
                                }
                            },
                            city: {isValid: false},
                            state: {isValid: false}
                        }
                    }
                }
            });
        });

        it('sets missing top-level object properties to valid', () => {
            const value = {
                workAddress: {
                    street: {}
                }
            };

            const result = validate(value);
            expect(result.objectProps.homeAddress.isValid).toBe(true);
        });

        it('sets missing nested object properties to valid', () => {
            const value = {
                workAddress: {}
            };

            const result = validate(value);

            expect(result.objectProps.workAddress.objectProps.street.isValid).toBe(true);
        });

        it('does not create objectProps for missing nested object properties', () => {
            const value = {};
            const result = validate(value);

            expect(result.objectProps).not.toHaveProperty('workAddress.objectProps.street.results');
        });
    });

    describe('passes context to the validators', () => {
        const validator = jest.fn();

        const validate = objectProps({
            first: validator
        }, {validatorProp: 'Validator prop'});

        const value = {
            first: 'A'
        };

        validate(value, {contextProp: 'Context prop'});

        it('from the validation context', () => {
            expect(validator).toHaveBeenCalledWith(value.first, expect.objectContaining({
                contextProp: 'Context prop'
            }));
        });
    });

    describe('allows context to be specified for individual props', () => {
        const name = jest.fn();
        const homeCity = jest.fn();

        const validate = objectProps({
            name,
            address: {
                home: {
                    city: homeCity
                }
            }
        });

        const value = {
            name: 'Stanford Strickland',
            address: {
                home: {
                    city: 'Hill Valley'
                }
            }
        };

        const context = {
            message: 'top-level',
            topLevelMessage: 'top-level message',
            objectProps: {
                name: {
                    message: 'name',
                    nameMessage: 'name message'
                },
                address: {
                    message: 'address',
                    addressMessage: 'address message',
                    objectProps: {
                        home: {
                            message: 'home',
                            homeMessage: 'home message',
                            objectProps: {
                                city: {
                                    message: 'home city',
                                    homeCityMessage: 'home city message'
                                }
                            }
                        }
                    }
                }
            }
        };

        validate(value, context);

        it('for top-level props', () => {
            expect(name).toHaveBeenCalledWith(value.name, expect.objectContaining({
                topLevelMessage: 'top-level message',
                nameMessage: 'name message',
                message: 'name'
            }));
        });

        it('for nested props', () => {
            expect(homeCity).toHaveBeenCalledWith(value.address.home.city, expect.objectContaining({
                topLevelMessage: 'top-level message',
                addressMessage: 'address message',
                homeMessage: 'home message',
                homeCityMessage: 'home city message',
                message: 'home city'
            }));
        });

        it('without passing objectProps context to the top-level props', () => {
            expect(name).not.toHaveBeenCalledWith(expect.objectContaining({
                objectProps: expect.anything()
            }));
        });

        it('without passing objectProps context to the nested props', () => {
            expect(homeCity).not.toHaveBeenCalledWith(expect.objectContaining({
                objectProps: expect.anything()
            }));
        });
    });

    describe('given async validators', () => {
        describe('returns a validateAsync function', () => {
            it('that returns a Promise', () => {
                const validate = objectProps({
                    firstProp: () => Promise.resolve(true)
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                expect(result.validateAsync()).toBeInstanceOf(Promise);
            });

            it('with exclusively nested results', () => {
                const validateNested = objectProps({
                    firstProp: objectProps({
                        secondProp: () => Promise.resolve(true)
                    })
                });

                const value = {
                    firstProp: {
                        secondProp: null
                    }
                };

                const nestedResult = validateNested(value);

                return expect(nestedResult.validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    objectProps: {
                        firstProp: {
                            isValid: true,
                            objectProps: {
                                secondProp: {isValid: true}
                            }
                        }
                    }
                });
            });
        });

        describe('resolves results', () => {
            it('resolves objectProps result, even when some are invalid', () => {
                const validate = objectProps({
                    firstProp: () => ({isValid: false, first: 'First'}),
                    secondProp: () => Promise.resolve({isValid: false, second: 'Second'}),
                    thirdProp: () => ({isValid: false, third: 'Third'}),
                    fourthProp: () => Promise.resolve({isValid: false, fourth: 'Fourth'}),
                    fifthProp: () => Promise.resolve({isValid: true, fifth: 'Fifth'})
                });

                const value = {
                    firstProp: null,
                    secondProp: null,
                    thirdProp: null,
                    fourthProp: null,
                    fifthProp: null
                };

                const result = validate(value);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    objectProps: {
                        firstProp: {isValid: false, first: 'First'},
                        secondProp: {isValid: false, second: 'Second'},
                        thirdProp: {isValid: false, third: 'Third'},
                        fourthProp: {isValid: false, fourth: 'Fourth'},
                        fifthProp: {isValid: true, fifth: 'Fifth'}
                    }
                });
            });

            it('that resolve as true', () => {
                const validate = objectProps({
                    firstProp: () => Promise.resolve(true)
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as a valid result object', () => {
                const validate = objectProps({
                    firstProp: () => Promise.resolve({isValid: true})
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as false', () => {
                const validate = objectProps({
                    firstProp: () => Promise.resolve(false)
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: false});
            });

            it('that resolve as an invalid result object', () => {
                const validate = objectProps({
                    firstProp: () => Promise.resolve({isValid: false})
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: false});
            });

            it('recursively', () => {
                const validate = objectProps({
                    firstProp: () => Promise.resolve(
                        Promise.resolve(
                            Promise.resolve({
                                isValid: true,
                                recursively: 'Yes!'
                            })
                        )
                    ),
                    secondProp: objectProps({
                        thirdProp: () => Promise.resolve(
                            Promise.resolve(true)
                        ),
                        fourthProp: objectProps({
                            fifthProp: () => Promise.resolve(
                                Promise.resolve({
                                    isValid: true,
                                    inNestedValidators: 'Yep'
                                })
                            )
                        })
                    })
                });

                const value = {
                    firstProp: null,
                    secondProp: {
                        thirdProp: null,
                        fourthProp: {
                            fifthProp: null
                        }
                    }
                };

                const result = validate(value);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    objectProps: {
                        firstProp: {recursively: 'Yes!'},
                        secondProp: {
                            objectProps: {
                                fourthProp: {
                                    objectProps: {
                                        fifthProp: {inNestedValidators: 'Yep'}
                                    }
                                }
                            }
                        }
                    }
                });
            });

            it('puts validator props on the resolved result', () => {
                const validate = objectProps({
                    firstProp: () => Promise.resolve(true)
                }, {validatorProp: 'Validator message'});

                const value = {
                    firstProp: null
                };

                const result = validate(value);

                return expect(result.validateAsync()).resolves.toMatchObject({
                    validatorProp: 'Validator message'
                });
            });

            it('does not put context props on the resolved result', () => {
                const validate = objectProps({
                    firstProp: () => Promise.resolve(true)
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value, {message: 'Message'});

                return expect(result.validateAsync()).resolves.not.toHaveProperty('message');
            });
        });

        describe('returns a partial result object', () => {
            const validate = objectProps({
                firstProp: () => ({isValid: true, first: 'First'}),
                secondProp: () => Promise.resolve({isValid: true, second: 'Second'}),
                nestedProp: objectProps({
                    thirdProp: () => ({isValid: true, third: 'Third'}),
                    fourthProp: () => Promise.resolve({isValid: true, fourth: 'Fourth'}),
                    fifthProp: () => ({isValid: true, fifth: 'Fifth'})
                }),
                sixthProp: () => ({isValid: true, sixth: 'Sixth'})
            });

            const value = {
                firstProp: null,
                secondProp: null,
                nestedProp: {
                    thirdProp: null,
                    fourthProp: null,
                    fifthProp: null
                },
                sixthProp: null
            };

            const result = validate(value);

            it('that is marked as not valid', () => {
                expect(result.isValid).toBe(false);
            });

            it('with sync results in place and Promise results where expected', () => {
                expect(result).toMatchObject({
                    objectProps: {
                        firstProp: {first: 'First'},
                        secondProp: {validateAsync: expect.any(Function)},
                        nestedProp: {
                            objectProps: {
                                thirdProp: {third: 'Third'},
                                fourthProp: {validateAsync: expect.any(Function)},
                                fifthProp: {fifth: 'Fifth'}
                            }
                        },
                        sixthProp: {sixth: 'Sixth'}
                    }
                });
            });

            it('with individual validator promises that will finish their results', () => {
                return expect(result.objectProps.nestedProp.objectProps.fourthProp.validateAsync()).resolves.toMatchObject({
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

                const validate = objectProps({}, {middleware});
                const result = validate({name: 'ABC'});

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

                    const validate = objectProps({name: required()}, props);
                    validate({name: 'ABC'}, context);

                    expect(middleware.prepareResult).toHaveBeenCalledWith(
                        // result
                        expect.objectContaining({
                            isValid: true,
                            objectProps: expect.objectContaining({}),
                            testProp: 'propValue'
                        }),

                        // middleware context
                        {
                            value: expect.objectContaining({name: 'ABC'}),
                            props: expect.objectContaining({
                                testProp: 'propValue'
                            }),
                            context,
                            validatorResult: expect.objectContaining({
                                objectProps: expect.objectContaining({
                                    name: expect.objectContaining({
                                        isValid: true,
                                        required: true
                                    })
                                })
                            })
                        }
                    );
                });

                it('allowing the prepared result to be overridden, omitting the `objectProps` result prop', () => {
                    const middleware = {
                        prepareResult: () => ({})
                    };

                    const validate = objectProps({}, {middleware});
                    const result = validate({name: 'ABC'});

                    expect(result).not.toHaveProperty('objectProps');
                });

                it('allowing the result to be augmented', () => {
                    const middleware = {
                        prepareResult: (result) => ({
                            ...result,
                            repeatedObjectProps: result.objectProps
                        })
                    };

                    const validate = objectProps({name: required()}, {middleware});
                    const result = validate({name: 'ABC'});

                    expect(result).toMatchObject({
                        isValid: true,
                        objectProps: expect.objectContaining({
                            name: expect.objectContaining({
                                isValid: true,
                                required: true,
                                value: 'ABC'
                            })
                        }),
                        repeatedObjectProps: expect.objectContaining({
                            name: expect.objectContaining({
                                isValid: true,
                                required: true,
                                value: 'ABC'
                            })
                        })
                    });
                });

                describe('allowing the `validatorResult` to be used instead of the core prepared result', () => {
                    const middleware = {
                        prepareResult: (result, { validatorResult }) => ({
                            ...validatorResult,
                            different: 'result object'
                        })
                    };

                    const validate = objectProps({name: required()}, {middleware, validatorProp: 'validator prop'});
                    const result = validate({name: 'ABC'});

                    it('while still merging that result and the validator props onto the final result', () => {
                        expect(result).toMatchObject({
                            different: 'result object'
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

                        const validate = objectProps({}, {middleware});
                        const result = validate();

                        expect(result.isValid).toBe(false);
                    });

                    it('forcing it to be true', () => {
                        const middleware = {
                            prepareResult: () => ({isValid: true})
                        };

                        const validate = objectProps({name: required()}, {middleware});
                        const result = validate({name: null});

                        expect(result.isValid).toBe(true);
                    });
                });

                it('supporting the scenario of adding a `validationErrors` result prop', () => {
                    const middleware = {
                        prepareResult: (result) => ({
                            ...result,
                            validationErrors: Object.keys(result.objectProps)
                                .map((propName) => result.objectProps[propName])
                                .filter(({isValid}) => !isValid)
                        })
                    };

                    const validate = objectProps({
                        a: [maxLength(2), minLength(1), required()],
                        ab: [maxLength(2), minLength(1)],
                        abc: [maxLength(2), minLength(1)]
                    }, {middleware});

                    const result = validate({
                        a: 'A',
                        ab: 'AB',
                        abc: 'ABC'
                    });

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

                    const validate = objectProps({name: required()}, props);
                    validate({name: 'ABC'}, context);

                    expect(middleware.reduceResults).toHaveBeenCalledWith(
                        // accumulator
                        expect.objectContaining({
                            isValid: true,
                            objectProps: expect.objectContaining({
                                name: expect.objectContaining({
                                    isValid: true,
                                    required: true
                                })
                            })
                        }),

                        // current result
                        expect.objectContaining({
                            isValid: true
                        }),

                        // middleware context
                        {
                            value: {name: 'ABC'},
                            props: expect.objectContaining({
                                testProp: 'propValue'
                            }),
                            context,
                            previousResult: expect.objectContaining({
                                isValid: true,
                                objectProps: expect.objectContaining({})
                            })
                        }
                    );
                });

                it('allowing the previousResult to be used, bypassing previous reduceResults middleware, therefore not populating the `objectProps` result prop', () => {
                    const middleware = {
                        reduceResults(accumulator, currentResult, { previousResult }) {
                            return previousResult;
                        }
                    };

                    const validate = objectProps({name: required()}, {middleware});
                    const result = validate({name: 'ABC'});

                    expect(Object.keys(result.objectProps)).toHaveLength(0);
                });

                it('allowing the reduced result to be augmented', () => {
                    const middleware = {
                        reduceResults: (accumulator, currentResult) => ({
                            ...accumulator,
                            objectProps: {
                                ...accumulator.objectProps,
                                extraResult: true
                            }
                        })
                    };

                    const validate = objectProps({name: required()}, {middleware});
                    const result = validate({name: 'ABC'});

                    expect(result).toMatchObject({
                        isValid: true,
                        objectProps: expect.objectContaining({
                            name: expect.objectContaining({
                                isValid: true,
                                required: true,
                                value: 'ABC'
                            }),
                            extraResult: true
                        })
                    });
                });

                it('allowing the reduced result to be completely overridden', () => {
                    const middleware = {
                        reduceResults: (accumulator, currentResult) => ({
                            replaced: true
                        })
                    };

                    const validate = objectProps({name: required()}, {middleware});
                    const result = validate({name: 'ABC'});

                    expect(result).toMatchObject({
                        replaced: true
                    });
                });

                it('guarding against the `objectProps` prop getting dropped between validators', () => {
                    const middleware = {
                        reduceResults: (accumulator, currentResult) => ({
                            replaced: true
                        })
                    };

                    const validate = objectProps({
                        first: required(),
                        second: minLength(1)
                    }, {middleware});

                    expect(() => validate({first: 'ABC', second: 'ABC'})).not.toThrow();
                });

                describe('allowing the `isValid` result prop to be overridden', () => {
                    it('forcing it to false', () => {
                        const middleware = {
                            reduceResults: (accumulator, currentResult) => ({
                                ...accumulator,
                                isValid: false
                            })
                        };

                        const validate = objectProps({name: required()}, {middleware});
                        const result = validate({name: 'ABC'});

                        expect(result.isValid).toBe(false);
                    });

                    it('forcing it to be true', () => {
                        const middleware = {
                            reduceResults: (accumulator, currentResult) => ({
                                ...accumulator,
                                isValid: true
                            })
                        };

                        const validate = objectProps({name: required()}, {middleware});
                        const result = validate({name: null});

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

                const validate = objectProps({});
                const result = validate({}, {middleware});

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

                const validate = objectProps({name: required()});
                const result = validate({}, {middleware});

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

                const validate = objectProps({name: required()}, {middleware: propsMiddleware});
                const result = validate({}, {middleware: contextMiddleware});

                expect(result).toMatchObject({
                    isValid: false,
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

                const validate = objectProps({name: required()}, {middleware: propsMiddleware});
                const result = validate({}, {middleware: contextMiddleware});

                expect(result).toMatchObject({
                    isValid: false,
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

            const validate = objectProps({name: required()}, {middleware: [middleware, middleware]});
            const result = validate({}, {middleware: [middleware, middleware, middleware]});

            expect(result).toMatchObject({
                fromPrepareResult: 5,
                fromReduceResults: 10
            });
        });

        it('using a withMiddleware wrapper', () => {
            const addFromPrepareResult = (result) => ({
                ...result,
                fromPrepareResult: (result.fromPrepareResult || 0) + 1
            });

            const addFromReduceResults = (accumulator, currentResult) => ({
                fromReduceResults: (accumulator.fromReduceResults || 0) + 1
            });

            const middleware = {
                prepareResult: addFromPrepareResult,
                reduceResults: addFromReduceResults
            };

            const validate = objectProps({name: required()}, {prop: 'propValue'});

            // Wrap in middleware twice for nested levels of middleware
            const validateWithMiddleware = withMiddleware(withMiddleware(validate, middleware), middleware);

            const result = validateWithMiddleware({});

            expect(result).toMatchObject({
                fromPrepareResult: 2,
                fromReduceResults: 2
            });
        });
    });
});
