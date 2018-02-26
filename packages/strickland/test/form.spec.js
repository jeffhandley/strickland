import {form, every, required, minLength, compare} from '../src/strickland';

describe('form', () => {
    describe('throws', () => {
        it('with undefined rules', () => {
            expect(() => form()).toThrow();
        });

        it('with null rules', () => {
            expect(() => form(null)).toThrow();
        });

        it('with numeric rules', () => {
            expect(() => form(1)).toThrow();
        });

        it('with string rules', () => {
            expect(() => form('string')).toThrow();
        });

        it('with an array for rules', () => {
            expect(() => form([{}])).toThrow();
        });

        it('with a function for rules', () => {
            expect(() => form(required())).toThrow();
        });
    });

    describe('validates forms', () => {
        describe('for a simple form', () => {
            const firstNameValidator = jest.fn().mockReturnValue(true);

            const formValidators = {
                firstName: firstNameValidator,
                lastName: required(),
                username: required(),
                password: [required(), minLength(6)],
                comparePassword: every(
                    [
                        required(),
                        compare(({form: {values}}) => values.password)
                    ], {fieldName: 'password confirmation'}
                )
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: '',
                password: 'marty88',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators, {validatorProp: 'Validator message'});
            const result = validate(formValues);

            it('validates', () => {
                expect(result).toMatchObject({
                    isValid: false,
                    value: formValues
                });
            });

            it('includes validationErrors on the form result', () => {
                expect(result.form).toMatchObject({
                    validationErrors: [
                        {
                            isValid: false,
                            required: true,
                            value: ''
                        },
                        {
                            isValid: false,
                            required: true,
                            compare: 'marty88',
                            value: 'einstein'
                        }
                    ]
                });
            });

            it('includes validationResults on the form result', () => {
                expect(result.form).toMatchObject({
                    validationResults: {
                        firstName: {isValid: true, value: 'Marty'},
                        lastName: {isValid: true, value: 'McFly'},
                        username: {isValid: false, value: ''},
                        password: {isValid: true, value: 'marty88'},
                        comparePassword: {isValid: false, value: 'einstein', compare: 'marty88'}
                    }
                });
            });

            it('includes default fieldName on the errors', () => {
                expect(result.form).toMatchObject({
                    validationErrors: [
                        {fieldName: 'username'},
                        {}
                    ]
                });
            });

            it('allows the default fieldName to be overridden in validator props', () => {
                expect(result.form).toMatchObject({
                    validationErrors: [
                        {},
                        {fieldName: 'password confirmation'}
                    ]
                });
            });

            it('includes the form on context for the fields', () => {
                expect(firstNameValidator).toHaveBeenCalledWith(formValues.firstName, expect.objectContaining({
                    form: {values: formValues}
                }));
            });

            it('the result includes a form.isComplete property set to true', () => {
                expect(result.form.isComplete).toBe(true);
            });

            it('puts validator props on the result', () => {
                expect(result).toMatchObject({validatorProp: 'Validator message'});
            });
        });

        describe('with existing validationErrors and validationResults on context', () => {
            const formValidators = {
                firstName: required(),
                lastName: required(),
                username: required(),
                password: [required(), minLength(6)],
                comparePassword: [required(), compare(({form: {values}}) => values.password)]
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: '',
                password: 'marty88',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators);

            const validationContext = {
                validationErrors: [
                    {fieldName: 'firstName', isValid: false},
                    {fieldName: 'lastName', isValid: false},
                    {fieldName: 'username', isValid: false},
                    {fieldName: 'password', isValid: false},
                    {fieldName: 'comparePassword', isValid: false}
                ],
                validationResults: {
                    firstName: {isValid: false},
                    lastName: {isValid: false},
                    username: {isValid: false},
                    password: {isValid: false},
                    comparePassword: {isValid: false}
                }
            };

            const result = validate(formValues, validationContext);

            it('the existing errors and results are overwritten', () => {
                expect(result.form).toMatchObject({
                    validationErrors: [
                        {
                            isValid: false,
                            required: true,
                            value: ''
                        },
                        {
                            isValid: false,
                            required: true,
                            compare: 'marty88',
                            value: 'einstein'
                        }
                    ],
                    validationResults: {
                        firstName: {
                            isValid: true,
                            required: true,
                            value: 'Marty'
                        },
                        lastName: {
                            isValid: true,
                            required: true,
                            value: 'McFly'
                        },
                        username: {
                            isValid: false,
                            required: true,
                            value: ''
                        },
                        password: {
                            isValid: true,
                            required: true,
                            minLength: 6,
                            value: 'marty88'
                        },
                        comparePassword: {
                            isValid: false,
                            required: true,
                            compare: 'marty88',
                            value: 'einstein'
                        }
                    }
                });
            });
        });
    });

    describe('validates fields', () => {
        describe('for a simple form and a single field', () => {
            const formValidators = {
                firstName: required(),
                lastName: required(),
                username: required(),
                password: [required(), minLength(6)],
                comparePassword: every(
                    [
                        required(),
                        compare(({form: {values}}) => values.password)
                    ], {fieldName: 'password confirmation'}
                )
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: '',
                password: 'marty88',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators);
            const result = validate(formValues, {form: {fields: 'username'}});

            it('validates', () => {
                expect(result).toMatchObject({
                    isValid: false,
                    value: formValues
                });
            });

            it('includes validationErrors on the result, but only for the field validated', () => {
                expect(result.form).toMatchObject({
                    validationErrors: [
                        {fieldName: 'username', isValid: false}
                    ]
                });
            });

            it('includes validationResults for the field validated', () => {
                expect(result.form).toMatchObject({
                    validationResults: {
                        username: {isValid: false}
                    }
                });
            });
        });

        describe('for a simple form and multiple fields', () => {
            const formValidators = {
                firstName: required(),
                lastName: required(),
                username: required(),
                password: [required(), minLength(6)],
                comparePassword: every(
                    [
                        required(),
                        compare(({value}) => value.password)
                    ], {fieldName: 'password confirmation'}
                )
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: '',
                password: 'marty88',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators);
            const result = validate(formValues, {form: {fields: ['username', 'password', 'comparePassword']}});

            it('validates', () => {
                expect(result).toMatchObject({
                    isValid: false,
                    value: formValues
                });
            });

            it('includes validationErrors on the result, but only for the fields validated', () => {
                expect(result.form).toMatchObject({
                    validationErrors: [
                        {fieldName: 'username'},
                        {fieldName: 'password confirmation'}
                    ]
                });
            });

            it('includes validationResults for the fields validated', () => {
                expect(result.form).toMatchObject({
                    validationResults: {
                        username: {isValid: false},
                        password: {isValid: true},
                        comparePassword: {isValid: false}
                    }
                });
            });
        });

        describe('with existing validationErrors and validationResults on context', () => {
            const formValidators = {
                firstName: required(),
                lastName: required(),
                username: required(),
                password: [required(), minLength(8)],
                comparePassword: [required(), compare(({form: {values}}) => values.password)]
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: '',
                password: 'marty88',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators);

            const validationContext = {
                form: {
                    fields: 'password',
                    validationErrors: [
                        {fieldName: 'firstName', isValid: false},
                        {fieldName: 'username', isValid: false},
                        {fieldName: 'password', isValid: false},
                        {fieldName: 'comparePassword', isValid: false}
                    ],
                    validationResults: {
                        firstName: {isValid: false},
                        lastName: {isValid: true, alreadyValidated: true},
                        username: {isValid: false},
                        password: {isValid: false},
                        comparePassword: {isValid: false}
                    }
                }
            };

            const result = validate(formValues, validationContext);

            it('the existing errors are overwritten, but only for the field validated', () => {
                let fieldErrors = {};

                result.form.validationErrors.forEach((fieldError) => {
                    fieldErrors = {
                        ...fieldErrors,
                        [fieldError.fieldName]: fieldError
                    };
                })

                expect(fieldErrors).toMatchObject({
                    firstName: {isValid: false},
                    username: {isValid: false},
                    password: {isValid: false, minLength: 8, value: 'marty88'},
                    comparePassword: {isValid: false}
                });
            });

            it('the existing results are overwritten, but only for the field validated', () => {
                expect(result.form.validationResults).toMatchObject({
                    firstName: {isValid: false},
                    lastName: {isValid: true, alreadyValidated: true},
                    username: {isValid: false},
                    password: {isValid: false, minLength: 8, value: 'marty88'},
                    comparePassword: {isValid: false}
                });
            });
        });

        describe('when validation is incomplete', () => {
            const formValidators = {
                firstName: required(),
                lastName: required(),
                username: [required(), () => Promise.resolve({isValid: true, usernameAvailable: true})],
                password: [required(), minLength(8)],
                comparePassword: [required(), compare(({form: {values}}) => values.password)]
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: 'marty',
                password: 'einstein',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators);

            const validationContext = {
                form: {
                    fields: 'password',
                    validationErrors: [],
                    validationResults: {
                        firstName: {isValid: true},
                        lastName: {isValid: true},
                        username: {isValid: true}
                    }
                }
            };

            const result = validate(formValues, validationContext);

            it('the overall result is invalid', () => {
                expect(result.isValid).toBe(false);
            });

            it('the result includes a form.isComplete property set to false', () => {
                expect(result.form.isComplete).toBe(false);
            });

            it('form.isComplete remains false even after subsequent validations when still not complete', () => {
                const secondValidationContext = result;
                const secondResult = validate(formValues, secondValidationContext);

                expect(secondResult.form.isComplete).toBe(false);
            });

            it('form.isComplete remains false even if there are the same number of validation results as there are fields, but when the validation results are for different fields', () => {
                const secondValidationContext = {
                    form: {
                        fields: 'password',
                        validationErrors: [],
                        validationResults: {
                            firstName: {isValid: true},
                            lastName: {isValid: true},
                            username: {isValid: true},
                            anotherField: {isValid: true} // comparePassword still not validated
                        }
                    }
                };

                const secondResult = validate(formValues, secondValidationContext);

                expect(secondResult.form.isComplete).toBe(false);
            });
        });

        describe('when async validation remains', () => {
            const formValidators = {
                firstName: required(),
                lastName: required(),
                username: required(),
                password: [required(), minLength(8)],
                comparePassword: [required(), compare(({form: {values}}) => values.password)]
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: 'marty',
                password: 'einstein',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators);

            const validationContext = {
                form: {
                    fields: 'comparePassword',
                    validationErrors: [],
                    validationResults: {
                        firstName: {isValid: true},
                        lastName: {isValid: true},
                        username: {
                            isValid: false,
                            validateAsync: Promise.resolve({
                                isValid: true,
                                usernameAvailable: true
                            })
                        },
                        password: {isValid: true}
                    }
                }
            };

            const result = validate(formValues, validationContext);

            it('the overall result is invalid', () => {
                expect(result.isValid).toBe(false);
            });

            it('the result includes a form.isComplete property set to false', () => {
                expect(result.form.isComplete).toBe(false);
            });

            it('the result includes a validateAsync promise', () => {
                expect(result.validateAsync).toBeInstanceOf(Promise);
            });

            it('validateAsync resolves to the final result', () => {
                return expect(result.validateAsync).resolves.toMatchObject({
                    isValid: true,
                    form: {
                        isComplete: true,
                        validationErrors: [],
                        validationResults: {
                            firstName: {isValid: true},
                            lastName: {isValid: true},
                            username: {
                                isValid: true,
                                usernameAvailable: true
                            },
                            password: {isValid: true},
                            comparePassword: {isValid: true}
                        }
                    }
                });
            });
        });

        describe('when async validation is triggered', () => {
            const formValidators = {
                firstName: required(),
                lastName: required(),
                username: [required(), () => Promise.resolve({isValid: true, usernameAvailable: true})],
                password: [required(), minLength(8)],
                comparePassword: [required(), compare(({form: {values}}) => values.password)]
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: 'marty',
                password: 'einstein',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators);

            const validationContext = {
                form: {
                    fields: 'username',
                    validationErrors: [],
                    validationResults: {
                        firstName: {isValid: true},
                        lastName: {isValid: true},
                        password: {isValid: true},
                        comparePassword: {isValid: true}
                    }
                }
            };

            const result = validate(formValues, validationContext);

            it('the overall result is invalid', () => {
                expect(result.isValid).toBe(false);
            });

            it('the result includes a form.isComplete property set to false', () => {
                expect(result.form.isComplete).toBe(false);
            });

            it('the result includes a validateAsync promise', () => {
                expect(result.validateAsync).toBeInstanceOf(Promise);
            });

            it('validateAsync resolves to the final result', () => {
                return expect(result.validateAsync).resolves.toMatchObject({
                    isValid: true,
                    form: {
                        isComplete: true,
                        validationErrors: [],
                        validationResults: {
                            firstName: {isValid: true},
                            lastName: {isValid: true},
                            username: {
                                isValid: true,
                                usernameAvailable: true
                            },
                            password: {isValid: true},
                            comparePassword: {isValid: true}
                        }
                    }
                });
            });
        });

        describe('when async validation remains and is triggered', () => {
            const formValidators = {
                firstName: required(),
                lastName: required(),
                username: [required(), () => Promise.resolve({isValid: true, usernameAvailable: true})],
                password: [required(), minLength(8)],
                comparePassword: [required(), compare(({form: {values}}) => values.password)]
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: 'marty',
                password: 'einstein',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators);

            const validationContext = {
                form: {
                    fields: 'username',
                    validationErrors: [],
                    validationResults: {
                        firstName: {isValid: true},
                        lastName: {isValid: true},
                        password: {isValid: false, validateAsync: Promise.resolve({isValid: true, passwordComplex: true})},
                        comparePassword: {isValid: true}
                    }
                }
            };

            const result = validate(formValues, validationContext);

            it('validateAsync resolves to the final result', () => {
                return expect(result.validateAsync).resolves.toMatchObject({
                    isValid: true,
                    form: {
                        isComplete: true,
                        validationErrors: [],
                        validationResults: {
                            firstName: {isValid: true},
                            lastName: {isValid: true},
                            username: {
                                isValid: true,
                                usernameAvailable: true
                            },
                            password: {
                                isValid: true,
                                passwordComplex: true
                            },
                            comparePassword: {isValid: true}
                        }
                    }
                });
            });
        });

        describe('when validation is complete', () => {
            const formValidators = {
                firstName: required(),
                lastName: required(),
                username: required(),
                password: [required(), minLength(8)],
                comparePassword: [required(), compare(({form: {values}}) => values.password)]
            };

            const formValues = {
                firstName: 'Marty',
                lastName: 'McFly',
                username: 'marty',
                password: 'einstein',
                comparePassword: 'einstein'
            };

            const validate = form(formValidators);

            it('the overall result is valid if all results are valid', () => {
                const validationContext = {
                    form: {
                        fields: 'comparePassword',
                        validationErrors: [],
                        validationResults: {
                            firstName: {isValid: true},
                            lastName: {isValid: true},
                            username: {isValid: true},
                            password: {isValid: true}
                        }
                    }
                };

                const result = validate(formValues, validationContext);

                expect(result.isValid).toBe(true);
            });

            it('the overall result is invalid if some results are invalid', () => {
                const validationContext = {
                    form: {
                        fields: 'comparePassword',
                        validationErrors: [],
                        validationResults: {
                            firstName: {isValid: true},
                            lastName: {isValid: true},
                            username: {isValid: false},
                            password: {isValid: true}
                        }
                    }
                };

                const result = validate(formValues, validationContext);

                expect(result.isValid).toBe(false);
            });

            it('the result includes a form.isComplete property set to true', () => {
                const validationContext = {
                    form: {
                        fields: 'comparePassword',
                        validationErrors: [],
                        validationResults: {
                            firstName: {isValid: true},
                            lastName: {isValid: true},
                            username: {isValid: true},
                            password: {isValid: true}
                        }
                    }
                };

                const result = validate(formValues, validationContext);

                expect(result.form.isComplete).toBe(true);
            });
        });
    });
});
