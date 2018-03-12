import {props, required, minLength, length} from '../src/strickland';

describe('props', () => {
    describe('throws', () => {
        it('with undefined rules', () => {
            expect(() => props()).toThrow();
        });

        it('with null rules', () => {
            expect(() => props(null)).toThrow();
        });

        it('with numeric rules', () => {
            expect(() => props(1)).toThrow();
        });

        it('with string rules', () => {
            expect(() => props('string')).toThrow();
        });

        it('with an array for rules', () => {
            expect(() => props([{}])).toThrow();
        });

        it('with a function for rules', () => {
            expect(() => props(required())).toThrow();
        });
    });

    it('returns a validate function', () => {
        const validate = props({});
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

        const validate = props(personProps, {validatorProp: 'Validator message'});
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
                props: {
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
                props: {
                    first: {isValid: true},
                    last: {isValid: true}
                }
            });
        });

        it('putting validator props on the result', () => {
            expect(result).toMatchObject({validatorProp: 'Validator message'});
        });
    });

    describe('with empty rules', () => {
        const validate = props({});
        const result = validate({});

        it('returns valid results', () => {
            expect(result.isValid).toBe(true);
        });

        it('returns empty props', () => {
            expect(result.props).toEqual({});
        });
    });

    describe('with nested rules objects', () => {
        const validate = props({
            name: required(),
            homeAddress: {
                street: required(),
                city: required(),
                state: [required(), length({minLength: 2, maxLength: 2})]
            },
            workAddress: {
                street: {
                    number: required(),
                    name: required()
                },
                city: required(),
                state: [required(), length({minLength: 2, maxLength: 2})]
            }
        });

        it('returns props in the shape of the rules', () => {
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

            expect(result.props).toMatchObject({
                name: {isValid: true},
                homeAddress: {
                    isValid: true,
                    props: {
                        street: {isValid: true},
                        city: {isValid: true},
                        state: {isValid: true}
                    }
                },
                workAddress: {
                    isValid: true,
                    props: {
                        street: {
                            isValid: true,
                            props: {
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
                props: {
                    homeAddress: {isValid: true},
                    workAddress: {
                        isValid: true,
                        props: {
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
                props: {
                    homeAddress: {
                        isValid: false
                    },
                    workAddress: {
                        isValid: false,
                        props: {
                            street: {
                                isValid: false,
                                props: {
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
        const validate = props({
            name: required(),
            homeAddress: {
                street: required(),
                city: required(),
                state: [required(), length({minLength: 2, maxLength: 2})]
            },
            workAddress: {
                street: {
                    number: required(),
                    name: required()
                },
                city: required(),
                state: [required(), length({minLength: 2, maxLength: 2})]
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
                props: {
                    name: {isValid: false},
                    homeAddress: {
                        isValid: false,
                        props: {
                            street: {isValid: false},
                            city: {isValid: false},
                            state: {isValid: false}
                        }
                    },
                    workAddress: {
                        isValid: false,
                        props: {
                            street: {
                                isValid: false,
                                props: {
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
            expect(result.props.homeAddress.isValid).toBe(true);
        });

        it('sets missing nested object properties to valid', () => {
            const value = {
                workAddress: {}
            };

            const result = validate(value);

            expect(result.props.workAddress.props.street.isValid).toBe(true);
        });

        it('does not create props for missing nested object properties', () => {
            const value = {};
            const result = validate(value);

            expect(result.props).not.toHaveProperty('workAddress.props.street.results');
        });
    });

    describe('passes context to the validators', () => {
        const validator = jest.fn();

        const validate = props({
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

        const validate = props({
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
            props: {
                name: {
                    message: 'name',
                    nameMessage: 'name message'
                },
                address: {
                    message: 'address',
                    addressMessage: 'address message',
                    props: {
                        home: {
                            message: 'home',
                            homeMessage: 'home message',
                            props: {
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

        it('without passing props context to the top-level props', () => {
            expect(name).not.toHaveBeenCalledWith(expect.objectContaining({
                props: expect.anything()
            }));
        });

        it('without passing props context to the nested props', () => {
            expect(homeCity).not.toHaveBeenCalledWith(expect.objectContaining({
                props: expect.anything()
            }));
        });
    });

    describe('given async validators', () => {
        describe('returns a validateAsync function', () => {
            it('that returns a Promise', () => {
                const validate = props({
                    firstProp: () => Promise.resolve(true)
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                expect(result.validateAsync()).toBeInstanceOf(Promise);
            });

            it('with exclusively nested results', () => {
                const validateNested = props({
                    firstProp: props({
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
                    props: {
                        firstProp: {
                            isValid: true,
                            props: {
                                secondProp: {isValid: true}
                            }
                        }
                    }
                });
            });
        });

        describe('resolves results', () => {
            it('resolves props result, even when some are invalid', () => {
                const validate = props({
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
                    props: {
                        firstProp: {isValid: false, first: 'First'},
                        secondProp: {isValid: false, second: 'Second'},
                        thirdProp: {isValid: false, third: 'Third'},
                        fourthProp: {isValid: false, fourth: 'Fourth'},
                        fifthProp: {isValid: true, fifth: 'Fifth'}
                    }
                });
            });

            it('that resolve as true', () => {
                const validate = props({
                    firstProp: () => Promise.resolve(true)
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as a valid result object', () => {
                const validate = props({
                    firstProp: () => Promise.resolve({isValid: true})
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as false', () => {
                const validate = props({
                    firstProp: () => Promise.resolve(false)
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: false});
            });

            it('that resolve as an invalid result object', () => {
                const validate = props({
                    firstProp: () => Promise.resolve({isValid: false})
                });

                const value = {
                    firstProp: null
                };

                const result = validate(value);
                return expect(result.validateAsync()).resolves.toMatchObject({isValid: false});
            });

            it('recursively', () => {
                const validate = props({
                    firstProp: () => Promise.resolve(
                        Promise.resolve(
                            Promise.resolve({
                                isValid: true,
                                recursively: 'Yes!'
                            })
                        )
                    ),
                    secondProp: props({
                        thirdProp: () => Promise.resolve(
                            Promise.resolve(true)
                        ),
                        fourthProp: props({
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
                    props: {
                        firstProp: {recursively: 'Yes!'},
                        secondProp: {
                            props: {
                                fourthProp: {
                                    props: {
                                        fifthProp: {inNestedValidators: 'Yep'}
                                    }
                                }
                            }
                        }
                    }
                });
            });

            it('puts validator props on the resolved result', () => {
                const validate = props({
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
                const validate = props({
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
            const validate = props({
                firstProp: () => ({isValid: true, first: 'First'}),
                secondProp: () => Promise.resolve({isValid: true, second: 'Second'}),
                nestedProp: props({
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
                    props: {
                        firstProp: {first: 'First'},
                        secondProp: {validateAsync: expect.any(Function)},
                        nestedProp: {
                            props: {
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
                return expect(result.props.nestedProp.props.fourthProp.validateAsync()).resolves.toMatchObject({
                    isValid: true,
                    fourth: 'Fourth'
                });
            });
        });
    });
});
