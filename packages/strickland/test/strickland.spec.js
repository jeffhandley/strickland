import expect from 'expect';
import validate, {isValid} from '../src/strickland';
import required from '../src/required';
import minLength from '../src/minLength';
import rangeLength from '../src/rangeLength';

describe('validate', () => {
    describe('throws', () => {
        it('with an undefined rules function', () => {
            expect(() => validate()).toThrow();
        });

        it('with a null rules function', () => {
            expect(() => validate(null)).toThrow();
        });

        it('with a numeric rules function', () => {
            expect(() => validate(1)).toThrow();
        });

        it('with a string rules function', () => {
            expect(() => validate('string')).toThrow();
        });
    });

    describe('with rules function', () => {
        describe('returning true', () => {
            const rules = () => true;
            const result = validate(rules, 'value');

            it('returns valid result', () => {
                expect(isValid(result)).toBe(true);
            });

            it('returns an object with isValid set to true', () => {
                expect(result.isValid).toBe(true);
            });
        });

        describe('returning false', () => {
            const rules = () => false;
            const result = validate(rules, 'value');

            it('returns invalid result', () => {
                expect(isValid(result)).toBe(false);
            });

            it('returns an object with isValid set to false', () => {
                expect(result.isValid).toBe(false);
            });
        });

        describe('returning a string', () => {
            describe('that is not empty', () => {
                const rules = () => 'That is not valid';
                const result = validate(rules, 'value');

                it('returns the string as the result message', () => {
                    expect(result.message).toEqual('That is not valid');
                });

                it('returns invalid result', () => {
                    expect(isValid(result)).toBe(false);
                });
            });

            describe('that is empty', () => {
                const rules = () => '';
                const result = validate(rules, 'value');

                it('returns a valid result ', () => {
                    expect(isValid(result)).toBe(true);
                });
            });
        });

        describe('returning an object', () => {
            it('returns an object with the rule result properties', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    customProp: 'This is a custom property'
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                const resultProps = {
                    message: result.message,
                    customProp: result.customProp
                };

                expect(resultProps).toEqual(ruleResult);
            });

            it('returns invalid result if the object is not marked as valid', () => {
                const ruleResult = {
                    message: 'That is not valid'
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(isValid(result)).toBe(false);
            });

            it('returns an object with isValid = false if the object does not specify isValid', () => {
                const ruleResult = {
                    message: 'That is not valid'
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(result.isValid).toBe(false);
            });

            describe('with isValid set to true', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: true
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                it('returns valid result', () => {
                    expect(isValid(result)).toBe(true);
                });

                it('returns an object with an isValid prop set to true', () => {
                    expect(result.isValid).toBe(true);
                });
            });

            it('returns an object with isValid = true if the object has isValid set to a truthy value other than true', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: 'Yep'
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(result.isValid).toBe(true);
            });

            it('returns invalid result if the object is marked as not valid', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: false
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(isValid(result)).toBe(false);
            });

            it('returns an object with isValid = false if the object has isValid set to a falsy value other than false', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: 0
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('with rules array', () => {
        describe('with all rules returning valid results', () => {
            let secondCalled = false;

            const rules = [
                () => ({
                    isValid: true,
                    first: true
                }),
                () => {
                    secondCalled = true;

                    return {
                        isValid: true,
                        second: true
                    };
                }
            ];

            const result = validate(rules, 'value');

            it('returns a valid result', () => {
                expect(isValid(result)).toBe(true);
            });

            it('includes props from the first validator', () => {
                expect(result.first).toBe(true);
            });

            it('includes props from the second validator', () => {
                expect(result.second).toBe(true);
            });

            it('calls the second validator', () => {
                expect(secondCalled).toBe(true);
            });
        });

        describe('with the first rule returning an invalid result', () => {
            let secondCalled = false;

            const rules = [
                () => ({
                    isValid: false,
                    first: true
                }),
                () => {
                    secondCalled = true;

                    return {
                        isValid: true,
                        second: false
                    };
                }
            ];

            const result = validate(rules, 'value');

            it('returns an invalid result', () => {
                expect(isValid(result)).toBe(false);
            });

            it('includes props from the first validator on the result', () => {
                expect(result.first).toBe(true);
            });

            it('does not include props from the second validator', () => {
                expect(result.second).toBeUndefined();
            });

            it('does not call the second validator', () => {
                expect(secondCalled).toBe(false);
            });
        });
    });

    describe('with rules object', () => {
        describe('where each property defines rules', () => {
            const rules = {
                firstName: required(),
                lastName: [required(), minLength(2)]
            };

            const value = {
                firstName: 'First',
                lastName: 'Last'
            };

            const result = validate(rules, value);

            it('returns with a results prop', () => {
                expect(result.results).not.toBeUndefined();
            });

            it('returns results in the shape of the rules', () => {
                const keys = Object.keys(result.results);
                expect(keys).toEqual(['firstName', 'lastName']);
            });

            it('returns validation results for the rules', () => {
                expect(result.results).toMatchObject({
                    firstName: {
                        isValid: true,
                        value: 'First'
                    },
                    lastName: {
                        isValid: true,
                        value: 'Last',
                        minLength: 2
                    }
                });
            });

            it('returns valid results', () => {
                const result = validate(rules, value);
                expect(result.isValid).toBe(true);
            });

            it('returns invalid results', () => {
                const invalidValue = {
                    firstName: 'First',
                    lastName: 'L'
                };

                const result = validate(rules, invalidValue);
                expect(result.isValid).toBe(false);
            });
        });

        describe('with nested rules objects', () => {
            const rules = {
                name: required(),
                homeAddress: {
                    street: required(),
                    city: required(),
                    state: [required(), rangeLength(2, 2)]
                },
                workAddress: {
                    street: {
                        number: required(),
                        name: required()
                    },
                    city: required(),
                    state: [required(), rangeLength(2, 2)]
                }
            };

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

                const result = validate(rules, value);

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

                const result = validate(rules, value);

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

                const result = validate(rules, value);

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

                const result = validate(rules, value);

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
                    state: [required(), rangeLength(2, 2)]
                },
                workAddress: {
                    street: {
                        number: required(),
                        name: required()
                    },
                    city: required(),
                    state: [required(), rangeLength(2, 2)]
                }
            };

            it('validates missing scalar values', () => {
                const value = {
                    homeAddress: {},
                    workAddress: {
                        street: {}
                    }
                };

                const result = validate(rules, value);

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

                const result = validate(rules, value);
                expect(result.results.homeAddress.isValid).toBe(true);
            });

            it('does not create results for missing top-level object properties', () => {
                const value = {};
                const result = validate(rules, value);

                expect(result.results).not.toHaveProperty('homeAddress.results');
            });

            it('sets missing nested object properties to valid', () => {
                const value = {
                    workAddress: {}
                };

                const result = validate(rules, value);

                expect(result.results.workAddress.results.street.isValid).toBe(true);
            });

            it('does not create results for missing nested object properties', () => {
                const value = {};
                const result = validate(rules, value);

                expect(result.results).not.toHaveProperty('workAddress.results.street.results');
            });
        });
    });
});
