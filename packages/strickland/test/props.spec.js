import expect from 'expect';
import {props, required, minLength, length} from '../src/strickland';

describe('props', () => {
    it('returns a validate function', () => {
        const validate = props();
        expect(validate).toBeInstanceOf(Function);
    });

    describe('validates', () => {
        const personProps = {
            first: required({message: 'First: required'}),
            last: [
                required({message: 'Last: required'}),
                minLength(2, {message: 'Last: minLength'})
            ]
        };

        const validate = props(personProps);
        const person = {
            first: '',
            last: 'A'
        };

        const result = validate(person);

        it('returning a result object', () => {
            expect(result).toBeInstanceOf(Object);
        });

        it('returning results for all properties', () => {
            expect(result).toMatchObject({
                results: {
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
                results: {
                    first: {isValid: true},
                    last: {isValid: true}
                }
            });
        });
    });

    describe('with nested rules objects', () => {
        const rules = {
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
        };

        const validate = props(rules);

        it('returns results in the shape of the rules', () => {
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

            expect(result.results).toMatchObject({
                name: {isValid: true},
                homeAddress: {
                    isValid: true,
                    results: {
                        street: {isValid: true},
                        city: {isValid: true},
                        state: {isValid: true}
                    }
                },
                workAddress: {
                    isValid: true,
                    results: {
                        street: {
                            isValid: true,
                            results: {
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

        it('parses values', () => {
            const value = {
                name: ' Name ',
                homeAddress: {
                    street: ' 9303 Lyon Dr. ',
                    city: ' Hill Valley ',
                    state: ' CA '
                },
                workAddress: {
                    street: {
                        number: 456,
                        name: ' Front St. '
                    },
                    city: ' City ',
                    state: ' ST '
                }
            };

            const result = validate(value);

            expect(result.results).toMatchObject({
                name: {
                    parsedValue: 'Name'
                },
                homeAddress: {
                    results: {
                        street: {
                            parsedValue: '9303 Lyon Dr.'
                        },
                        city: {
                            parsedValue: 'Hill Valley'
                        },
                        state: {
                            parsedValue: 'CA'
                        }
                    }
                },
                workAddress: {
                    results: {
                        street: {
                            results: {
                                number: {
                                    parsedValue: '456'
                                },
                                name: {
                                    parsedValue: 'Front St.'
                                }
                            }
                        },
                        city: {
                            parsedValue: 'City'
                        },
                        state: {
                            parsedValue: 'ST'
                        }
                    }
                }
            });
        });

        it('returns valid results', () => {
            const value = {
                name: 'Name',
                homeAddress: {
                    street: ' 9303 Lyon Dr. ',
                    city: ' Hill Valley ',
                    state: ' CA '
                },
                workAddress: {
                    street: {
                        number: 456,
                        name: ' Front St. '
                    },
                    city: ' City ',
                    state: ' ST '
                }
            };

            const result = validate(value);

            expect(result).toMatchObject({
                isValid: true,
                results: {
                    homeAddress: {isValid: true},
                    workAddress: {
                        isValid: true,
                        results: {
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
                results: {
                    homeAddress: {
                        isValid: false
                    },
                    workAddress: {
                        isValid: false,
                        results: {
                            street: {
                                isValid: false,
                                results: {
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
        const rules = {
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
        };

        const validate = props(rules);

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
                results: {
                    name: {isValid: false},
                    homeAddress: {
                        isValid: false,
                        results: {
                            street: {isValid: false},
                            city: {isValid: false},
                            state: {isValid: false}
                        }
                    },
                    workAddress: {
                        isValid: false,
                        results: {
                            street: {
                                isValid: false,
                                results: {
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
            expect(result.results.homeAddress.isValid).toBe(true);
        });

        it('does not create results for missing top-level object properties', () => {
            const value = {};
            const result = validate(value);

            expect(result.results).not.toHaveProperty('homeAddress.results');
        });

        it('sets missing nested object properties to valid', () => {
            const value = {
                workAddress: {}
            };

            const result = validate(value);

            expect(result.results.workAddress.results.street.isValid).toBe(true);
        });

        it('does not create results for missing nested object properties', () => {
            const value = {};
            const result = validate(value);

            expect(result.results).not.toHaveProperty('workAddress.results.street.results');
        });
    });
});
