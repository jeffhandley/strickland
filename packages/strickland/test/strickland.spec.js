import validate, {required, minLength} from '../src/strickland';

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
        it('returns the validated value on the result', () => {
            const rules = () => true;
            const result = validate(rules, 'validated value');

            expect(result.value).toBe('validated value');
        });

        describe('returning true', () => {
            const rules = () => true;
            const result = validate(rules, 'value');

            it('returns an object with isValid set to true', () => {
                expect(result.isValid).toBe(true);
            });
        });

        describe('returning false', () => {
            const rules = () => false;
            const result = validate(rules, 'value');

            it('returns an object with isValid set to false', () => {
                expect(result.isValid).toBe(false);
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

                expect(result.isValid).toBe(false);
            });

            it('returns an invalid result if the object has isValid set to a falsy value other than false', () => {
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
                expect(result.isValid).toBe(true);
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
                expect(result.isValid).toBe(false);
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

            it('returns props on the result', () => {
                expect(result.props).not.toBeUndefined();
            });

            it('returns props in the shape of the rules', () => {
                const keys = Object.keys(result.props);
                expect(keys).toEqual(['firstName', 'lastName']);
            });

            it('returns props being the results of the rules', () => {
                expect(result.props).toMatchObject({
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
                const validResult = validate(rules, value);
                expect(validResult.isValid).toBe(true);
            });

            it('returns invalid results', () => {
                const invalidValue = {
                    firstName: 'First',
                    lastName: 'L'
                };

                const invalidResult = validate(rules, invalidValue);
                expect(invalidResult.isValid).toBe(false);
            });
        });
    });

    describe('with hybrid object validators', () => {
        function validateWorkAddress(address) {
            const message = 'Work address must be on a St.';
            let isValidWorkAddress = true;

            if (address.street.name.indexOf(' St.') === -1) {
                isValidWorkAddress = false;
            }

            return {
                isValid: isValidWorkAddress,
                message
            };
        }

        const rules = {
            name: required({message: 'Name is required'}),
            workAddress: [
                // the pattern illustrated here is to first
                // ensure the address object is supplied
                // and then to validate its fields
                // and lastly perform object-level validation
                required({message: 'Work address is required'}),
                {
                    street: [
                        required({message: 'Street is required'}),
                        {
                            number: required({message: 'Street number is required'}),
                            name: required({message: 'Street name is required'})
                        }
                    ],
                    city: required({message: 'City is required'}),
                    state: required({message: 'State is required'})
                },
                validateWorkAddress
            ]
        };

        it('validates top-level object properties', () => {
            const value = {
                name: 'Name',
                workAddress: null
            };

            const result = validate(rules, value);

            expect(result).toMatchObject({
                isValid: false,
                props: {
                    name: {isValid: true},
                    workAddress: {
                        isValid: false,
                        message: 'Work address is required'
                    }
                }
            });
        });

        it('validates nested object properties', () => {
            const value = {
                name: 'Name',
                workAddress: {
                    street: null,
                    city: '',
                    state: ''
                }
            };

            const result = validate(rules, value);

            expect(result).toMatchObject({
                props: {
                    workAddress: {
                        props: {
                            street: {
                                isValid: false,
                                message: 'Street is required'
                            },
                            city: {
                                isValid: false,
                                message: 'City is required'
                            },
                            state: {
                                isValid: false,
                                message: 'State is required'
                            }
                        }
                    }
                }
            });
        });

        it('validates custom validators for objects', () => {
            const value = {
                name: 'Name',
                workAddress: {
                    street: {
                        number: 123,
                        name: 'Hollywood Blvd.'
                    },
                    city: 'City',
                    state: 'ST'
                }
            };

            const result = validate(rules, value);

            expect(result).toMatchObject({
                props: {
                    workAddress: {
                        isValid: false,
                        message: 'Work address must be on a St.'
                    }
                }
            });
        });
    });

    describe('with props passed into validation', () => {
        it('passes those props into a validator function', () => {
            let validatedProps;

            function validator(value, validateProps) {
                validatedProps = validateProps;
            }

            const props = {message: 'validation message'};

            validate(validator, null, props);
            expect(validatedProps).toMatchObject(props);
        });

        it('passes those props into each validator in an array', () => {
            let validatedProps = {
                first: null,
                second: null
            };

            function firstValidator(value, validateProps) {
                validatedProps.first = validateProps;
                return true;
            }

            function secondValidator(value, validateProps) {
                validatedProps.second = validateProps;
                return true;
            }

            const rules = [firstValidator, secondValidator];
            const props = {message: 'validation message'};

            validate(rules, null, props);

            expect(validatedProps).toMatchObject({
                first: props,
                second: props
            });
        });

        it('passes those props into each validator on an object', () => {
            let validatedProps = {
                first: null,
                second: null
            };

            function firstValidator(value, validateProps) {
                validatedProps.first = validateProps;
                return true;
            }

            function secondValidator(value, validateProps) {
                validatedProps.second = validateProps;
                return true;
            }

            const rules = {
                first: firstValidator,
                second: secondValidator
            };

            const props = {message: 'validation message'};
            const value = {
                first: 'First',
                second: 'Second'
            };

            validate(rules, value, props);

            expect(validatedProps).toMatchObject({
                first: props,
                second: props
            });
        });

        it('includes those props on the result automatically', () => {
            let props = {message: 'Message'};

            function validator() {
                return true;
            }

            const result = validate(validator, null, props);

            expect(result).toMatchObject({
                message: 'Message'
            });
        });
    });

    describe('given async validators', () => {
        it('returns a Promise if the validator returns a Promise', () => {
            const result = validate(() => Promise.resolve());
            expect(result).toBeInstanceOf(Promise);
        });

        describe('resolves results', () => {
            it('that resolve as true', () => {
                const result = validate(() => Promise.resolve(true));
                expect(result).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as a valid result object', () => {
                const result = validate(() => Promise.resolve({isValid: true}));
                expect(result).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as false', () => {
                const result = validate(() => Promise.resolve(false));
                expect(result).resolves.toMatchObject({isValid: false});
            });

            it('that resolve as an invalid result object', () => {
                const result = validate(() => Promise.resolve({isValid: false}));
                expect(result).resolves.toMatchObject({isValid: false});
            });
        });

        it('puts the value on the resolved result', () => {
            const result = validate(() => Promise.resolve(true), 'ABC');
            expect(result).resolves.toMatchObject({value: 'ABC'});
        });

        it('puts validate props on the resolved result', () => {
            const result = validate(() => Promise.resolve(true), 'ABC', {message: 'Message'});
            expect(result).resolves.toMatchObject({message: 'Message'});
        });
    });
});
