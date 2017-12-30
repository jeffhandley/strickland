import validate, {props, required, minLength, length, range, every} from '../src/strickland';

describe('readme', () => {
    it('performing validation', () => {
        function letterA(value) {
            return (value === 'A');
        }

        const result = validate(letterA, 'B');

        /*
        result = {
            isValid: false,
            value: 'B'
        }
        */

        expect(result).toMatchObject({
            isValid: false,
            value: 'B'
        });
    });

    it('validator factories', () => {
        function letter(letterParam) {
            return function validateLetter(value) {
                return (value === letterParam);
            }
        }

        const validator = letter('B');
        const result = validate(validator, 'B');

        /*
        result = {
            isValid: true,
            value: 'B'
        }
        */

        expect(result).toMatchObject({
            isValid: true,
            value: 'B'
        });
    });

    it('validation context', () => {
        function letter(letterParam) {
            return function validateLetter(value, validationContext) {
                validationContext = {
                    letter: letterParam,
                    ...validationContext
                };

                return (value === validationContext.letter);
            }
        }

        const validator = letter();
        const result = validate(validator, 'B', { letter: 'A' });

        /*
        result = {
            isValid: false,
            value: 'B'
        }
        */

        expect(result).toMatchObject({
            isValid: false,
            value: 'B'
        });
    });

    it('extensible validation results', () => {
        function letter(letterParam) {
            return function validateLetter(value, validationContext) {
                validationContext = {
                    letter: letterParam,
                    ...validationContext
                };

                return {
                    message: `Must match "${validationContext.letter}"`,
                    isValid: (value === validationContext.letter)
                };
            }
        }

        const validator = letter();
        const result = validate(validator, 'A', { letter: 'A' });

        /*
        result = {
            message: 'Must match "A"',
            isValid: true,
            value: 'A'
        }
        */

        expect(result).toMatchObject({
            message: 'Must match "A"',
            isValid: true,
            value: 'A'
        });
    });

    it('extensibility pattern', () => {
        function letter(letterParam, validatorContext) {
            if (typeof letterParam === 'object') {
                validatorContext = letterParam;
            } else {
                validatorContext = {
                    ...validatorContext,
                    letter: letterParam
                };
            }

            return function validateLetter(value, validationContext) {
                validationContext = {
                    ...validatorContext,
                    ...validationContext
                };

                return {
                    message: `Must match "${validationContext.letter}"`,
                    ...validationContext,
                    isValid: (value === validationContext.letter)
                };
            }
        }

        const termsAccepted = letter({
            letter: 'Y',
            fieldName: 'acceptTerms',
            message: 'Enter the letter "Y" to accept the terms'
        });

        const termsEntered = 'N';

        const result = validate(termsAccepted, termsEntered, {
            formName: 'signupForm'
        });

        /*
        result = {
            letter: 'Y',
            fieldName: 'acceptTerms',
            formName: 'signupForm',
            isValid: false,
            value: 'N'
        }
        */

        expect(result).toMatchObject({
            letter: 'Y',
            fieldName: 'acceptTerms',
            formName: 'signupForm',
            isValid: false,
            value: 'N'
        });
    });

    it('arrays of validators', () => {
        function everyValidator(validators) {
            return function validateEvery(value, validationContext) {
                let result = {
                    ...validationContext,
                    value,
                    isValid: true
                };

                validators.every((validator) => {
                    let validatorResult = validate(
                        validator, value, validationContext
                    );

                    result = {
                        ...result,
                        ...validatorResult,
                        isValid: validatorResult.isValid
                    };

                    return result.isValid;
                });

                return result;
            }
        }

        const mustExistWithLength5 = everyValidator([required(), minLength(5)]);
        const result = validate(mustExistWithLength5, '1234', {
            message: 'Must have a length of at least 5'
        });

        /*
        result = {
            isValid: false,
            value: '1234',
            required: true,
            minLength: 5,
            message: 'Must have a length of at least 5'
        }
        */

        expect(result).toMatchObject({
            isValid: false,
            value: '1234',
            required: true,
            minLength: 5,
            message: 'Must have a length of at least 5'
        });
    });

    it('validating objects', () => {
        // Define the rules for first name, last name, and birthYear
        const validateProps = {
            firstName: every([required(), length(2, 20)]),
            lastName: every([required(), length(2, 20)]),
            birthYear: range(1900, 2018)
        };

        // Create a person
        const person = {
            firstName: 'Stanford',
            lastName: 'Strickland',
            birthYear: 1925
        };

        // Validate the person's properties
        const propsDemo = {
            firstName: validate(validateProps.firstName, person.firstName),
            lastName: validate(validateProps.lastName, person.lastName),
            birthYear: validate(validateProps.birthYear, person.birthYear)
        };

        // Create a top-level result including the results from the props
        const result = {
            props: propsDemo,
            isValid: (
                propsDemo.firstName.isValid &&
                propsDemo.lastName.isValid &&
                propsDemo.birthYear.isValid
            ),
            value: person
        };

        expect(result.isValid).toBe(true);
    });

    it('advanced object validation', () => {
        // Define the rules for first name, last name, and birthYear
        const validatePersonProps = props({
            firstName: every([required(), length(2, 20)]),
            lastName: every([required(), length(2, 20)]),
            birthYear: range(1900, 2018)
        });

        function stanfordStricklandBornIn1925(person) {
            if (!person) {
                // If there's no person provided, return valid and
                // rely on `required` to ensure a person exists
                return true;
            }

            const {firstName, lastName} = person;

            if (firstName === 'Stanford' && lastName === 'Strickland') {
                return (person.birthYear === 1925);
            }

            return true;
        }

        const validatePerson = every([
            required(),
            validatePersonProps,
            stanfordStricklandBornIn1925
        ]);

        // Create a person
        const person = {
            firstName: 'Stanford',
            lastName: 'Strickland',
            birthYear: 1925
        };

        const result = validate(validatePerson, person);
        expect(result.isValid).toBe(true);
    });

    it('nested objects', () => {
        const validatePerson = props({
            name: every([required(), length(5, 40)]),
            address: props({
                street: props({
                    number: every([required(), range(1, 99999)]),
                    name: every([required(), length(2, 40)])
                }),
                city: required(),
                state: every([required(), length(2, 2)])
            })
        });

        const person = {
            name: 'Marty McFly',
            address: {
                street: {
                    number: 9303,
                    name: 'Lyon Drive'
                },
                city: 'Hill Valley',
                state: 'CA'
            }
        };

        const result = validate(validatePerson, person);

        expect(result).toMatchObject({
            isValid: true,
            props: {
                address: {
                    isValid: true,
                    props: {
                        street: {
                            isValid: true,
                            props: {
                                number: {isValid: true},
                                name: {isValid: true}
                            }
                        }
                    }
                }
            }
        });
    });

    it('conventions', () => {
        const validatePerson = {
            name: [required(), length(5, 40)],
            address: {
                street: {
                    number: [required(), range(1, 99999)],
                    name: [required(), length(2, 40)]
                },
                city: required(),
                state: [required(), length(2, 2)]
            }
        };

        const person = {
            name: 'Marty McFly',
            address: {
                street: {
                    number: 9303,
                    name: 'Lyon Drive'
                },
                city: 'Hill Valley',
                state: 'CA'
            }
        };

        const result = validate(validatePerson, person);

        expect(result).toMatchObject({
            isValid: true,
            props: {
                address: {
                    isValid: true,
                    props: {
                        street: {
                            isValid: true,
                            props: {
                                number: {isValid: true},
                                name: {isValid: true}
                            }
                        }
                    }
                }
            }
        });
    });

    describe('async validators', () => {
        function usernameIsAvailable(username) {
            if (!username) {
                return true;
            }

            return new Promise((resolve) => {
                if (username === 'marty') {
                    resolve({
                        isValid: false,
                        message: `"${username}" is not available`
                    });
                }

                resolve(true);
            });
        }

        it('first example', () => {
            return validate(usernameIsAvailable, 'marty').then((result) => {
                expect(result).toMatchObject({
                    isValid: false,
                    value: 'marty',
                    message: '"marty" is not available'
                });
            });
        });

        describe('async validator arrays and objects', () => {
            function validateCity(address) {
                if (!address) {
                    return true;
                }

                return new Promise((resolve) => {
                    if (address.city === 'Hill Valley' && address.state !== 'CA') {
                        resolve({
                            isValid: false,
                            message: 'Hill Valley is in California'
                        });
                    } else {
                        resolve(true);
                    }
                });
            }

            const validatePerson = {
                name: [required(), length(2, 20, {message: 'Name must be 2-20 characters'})],
                username: [required(), length(2, 20), usernameIsAvailable],
                address: [
                    required({message: 'Address is required'}),
                    {
                        street: [required(), length(2, 40)],
                        city: [required(), length(2, 40)],
                        state: [required(), length(2, 2)]
                    },
                    validateCity
                ]
            };

            const person = {
                name: 'Marty McFly',
                username: 'marty',
                address: {
                    street: '9303 Lyon Dr.',
                    city: 'Hill Valley',
                    state: 'WA'
                }
            };

            it('async results', () => {
                const result = validate(validatePerson, person);

                return result.then((resolvedResult) => {
                    expect(resolvedResult).toMatchObject({
                        isValid: false,
                        props: {
                            name: {
                                isValid: true,
                                value: 'Marty McFly'
                            },
                            username: {
                                isValid: false,
                                value: 'marty',
                                message: '"marty" is not available'
                            },
                            address: {
                                isValid: false,
                                message: 'Hill Valley is in California',
                                props: {
                                    street: {isValid: true},
                                    city: {isValid: true},
                                    state: {isValid: true}
                                }
                            }
                        }
                    });
                });
            });

            describe('partial results', () => {
                function checkUsernameAvailability(username) {
                    if (!username) {
                        // Return just a boolean - it will be
                        // converted to a valid result
                        return true;
                    }

                    // Return an initial result indicating the value is
                    // not valid (yet), but validation is in progress
                    return {
                        isValid: false,
                        message: `Checking availability of "${username}"...`,
                        async: new Promise((resolve) => {

                            if (username === 'marty') {

                                // Produce an async result object with
                                // a message
                                resolve({
                                    isValid: false,
                                    message: `"${username}" is not available`
                                });
                            }

                            // Produce an async result using just a boolean
                            resolve(true);
                        })
                    };
                }

                const validateUser = {
                    name: [required(), length(2, 20)],
                    username: [required(), length(2, 20), checkUsernameAvailability]
                };

                const user = {
                    name: 'Marty McFly',
                    username: 'marty'
                };

                // Pass {async: false} to get immediate but partial results
                const result = validate(validateUser, user, {async: false});

                it('initial result', () => {
                    expect(result).toMatchObject({
                        isValid: false,
                        props: {
                            name: {
                                isValid: true,
                                value: 'Marty McFly'
                            },
                            username: {
                                isValid: false,
                                value: 'marty',
                                required: true,
                                minLength: 2,
                                maxLength: 20,
                                message: 'Checking availability of "marty"...',
                                async: Promise.prototype
                            }
                        },
                        async: Promise.prototype
                    });
                });

                it('async result', () => {
                    return result.async.then((asyncResult) => {
                        expect(asyncResult).toMatchObject({
                            isValid: false,
                            props: {
                                name: {
                                    isValid: true,
                                    value: 'Marty McFly'
                                },
                                username: {
                                    isValid: false,
                                    value: 'marty',
                                    required: true,
                                    minLength: 2,
                                    maxLength: 20,
                                    message: '"marty" is not available',
                                    async: false
                                }
                            },
                            async: false
                        });
                    });
                });
            });
        });
    });
});
