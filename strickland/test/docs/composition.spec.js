import validate, {
    required,
    compare,
    min,
    max,
    range,
    minLength,
    maxLength,
    length,
    every,
    all,
    some,
    arrayOf,
    objectProps
} from '../../src/strickland';

describe('docs', () => {
    describe('composition', () => {
        it('arrays of validators', () => {
            function everyValidator(validators) {
                return function validateEvery(value, context) {
                    let result = {
                        value,
                        isValid: true
                    };

                    validators.every((validator) => {
                        let validatorResult = validate(
                            validator, value, context
                        );

                        result = {
                            ...result,
                            ...validatorResult,
                            isValid: validatorResult.isValid
                        };

                        return result.isValid;
                    });

                    return result;
                };
            }

            const mustExistWithLength5 = everyValidator([
                required(),
                minLength(5)
            ]);

            const result = validate(mustExistWithLength5, '1234', {
                message: 'Must have a length of at least 5'
            });

            expect(result).toMatchObject({
                isValid: false,
                value: '1234',
                required: true,
                minLength: 5,
                length: 4
            });
        });

        describe('every', () => {
            it('atLeast5Chars', () => {
                const atLeast5Chars = every(
                    [
                        required(),
                        minLength(5)
                    ],
                    {message: 'Must have at least 5 characters'}
                );

                const result = validate(atLeast5Chars, '1234');

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    length: 4,
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters'
                });
            });

            it('requiredWithMinLength', () => {
                const requiredWithMinLength = every(
                    [
                        required(),
                        minLength((context) => ({minLength: context.minLength}))
                    ],
                    (context) => ({message: `Must have at least ${context.minLength} characters`})
                );

                const result = validate(requiredWithMinLength, '1234', {minLength: 5});

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    length: 4,
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters'
                });
            });

            it('mustExistWithLength5to10', () => {
                const mustExistWithLength5to10 = every([
                    required({message: 'Required'}),
                    minLength({minLength: 5, message: 'Must have at least 5 characters'}),
                    maxLength({maxLength: 10, message: 'Must have at most 10 characters'})
                ]);

                const result = validate(mustExistWithLength5to10, '1234');

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters',
                    every: [
                        {
                            isValid: true,
                            value: '1234',
                            required: true,
                            message: 'Required'
                        },
                        {
                            isValid: false,
                            value: '1234',
                            minLength: 5,
                            message: 'Must have at least 5 characters'
                        }
                    ]
                });
            });
        });

        describe('all', () => {
            it('atLeast5Chars', () => {
                const atLeast5Chars = all(
                    [
                        required(),
                        minLength(5)
                    ],
                    {message: 'Must have at least 5 characters'}
                );

                const result = validate(atLeast5Chars, '1234');

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    length: 4,
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters'
                });
            });

            it('requiredWithMinLength', () => {
                const requiredWithMinLength = all(
                    [
                        required(),
                        minLength((context) => ({minLength: context.minLength}))
                    ],
                    (context) => ({message: `Must have at least ${context.minLength} characters`})
                );

                const result = validate(requiredWithMinLength, '1234', {minLength: 5});

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    length: 4,
                    required: true,
                    minLength: 5,
                    message: 'Must have at least 5 characters'
                });
            });

            it('mustExistWithLength5to10', () => {
                const mustExistWithLength5to10 = all([
                    required({message: 'Required'}),
                    minLength({minLength: 5, message: 'Must have at least 5 characters'}),
                    maxLength({maxLength: 10, message: 'Must have at most 10 characters'})
                ]);

                const result = validate(mustExistWithLength5to10, '1234');

                expect(result).toMatchObject({
                    isValid: false,
                    value: '1234',
                    required: true,
                    minLength: 5,
                    message: 'Must have at most 10 characters',
                    all: [
                        {
                            isValid: true,
                            value: '1234',
                            required: true,
                            message: 'Required'
                        },
                        {
                            isValid: false,
                            value: '1234',
                            minLength: 5,
                            message: 'Must have at least 5 characters'
                        },
                        {
                            isValid: true,
                            value: '1234',
                            maxLength: 10,
                            message: 'Must have at most 10 characters'
                        }
                    ]
                });
            });
        });

        describe('some', () => {
            const max5orMin10orValue7 = some([
                max(5),
                min(10),
                compare(7)
            ]);

            const result = validate(max5orMin10orValue7, 12);

            expect(result).toMatchObject({
                isValid: true,
                value: 12,
                max: 5,
                min: 10,
                some: [
                    {
                        isValid: false,
                        value: 12,
                        max: 5
                    },
                    {
                        isValid: true,
                        value: 12,
                        min: 10
                    }
                ]
            });
        });

        it('validating arrays', () => {
            const allValuesRequired = arrayOf(
                required(),
                {message: 'Must have at least 5 characters'}
            );

            const result = validate(allValuesRequired, ['First', '', 'Third']);

            const allValuesHaveMinLength = arrayOf(
                minLength((context) => ({minLength: context.minLength})),
                (context) => ({message: `All values must have at least ${context.minLength} characters`})
            );

            expect(result).toMatchObject({
                isValid: false,
                arrayOf: [
                    expect.objectContaining({isValid: true}),
                    expect.objectContaining({isValid: false}),
                    expect.objectContaining({isValid: true})
                ]
            });

            expect(validate(allValuesHaveMinLength, ['1', '12', '123', '1234'], {minLength: 3})).toMatchObject({
                isValid: false,
                value: ['1', '12', '123', '1234'],
                message: 'All values must have at least 3 characters',
                arrayOf: [
                    {
                        isValid: false,
                        value: '1',
                        minLength: 3,
                        length: 1
                    },
                    {
                        isValid: false,
                        value: '12',
                        minLength: 3,
                        length: 2
                    },
                    {
                        isValid: true,
                        value: '123',
                        minLength: 3,
                        length: 3
                    },
                    {
                        isValid: true,
                        value: '1234',
                        minLength: 3,
                        length: 4
                    }
                ]
            });
        });

        it('validating objects', () => {
            // Define the rules for first name, last name, and birthYear
            const personValidator = {
                firstName: every([
                    required(),
                    length(2, 20)
                ]),
                lastName: every([
                    required(),
                    length(2, 20)
                ]),
                birthYear: range(1900, 2018)
            };

            // Create a person
            const person = {
                firstName: 'Stanford',
                lastName: 'Strickland',
                birthYear: 1925
            };

            // Validate the person's properties
            const personResult = {
                firstName: validate(personValidator.firstName, person.firstName),
                lastName: validate(personValidator.lastName, person.lastName),
                birthYear: validate(personValidator.birthYear, person.birthYear)
            };

            // Create a top-level result including the results from personResult
            const result = {
                personResult,
                isValid: (
                    personResult.firstName.isValid &&
                    personResult.lastName.isValid &&
                    personResult.birthYear.isValid
                ),
                value: person
            };

            expect(result).toMatchObject({
                personResult: {
                    firstName: {
                        isValid: true,
                        value: 'Stanford'
                    },
                    lastName: {
                        isValid: true,
                        value: 'Strickland'
                    },
                    birthYear: {
                        isValid: true,
                        value: 1925
                    }
                }
            });
        });

        describe('objectProps', () => {
            it('parameters', () => {
                const personValidator = objectProps({
                    firstName: every([required(), length(2, 20)]),
                    lastName: every([required(), length(2, 20)]),
                    birthYear: range(1900, 2018)
                }, {
                    message: 'The person must be valid'
                });

                const result = validate(personValidator, {});

                expect(result).toMatchObject({
                    isValid: false,
                    message: 'The person must be valid'
                });
            });

            it('validation context', () => {
                const personValidator = objectProps({
                    firstName: every([
                        required(),
                        length((context) => ({
                            minLength: context.minLength,
                            maxLength: context.maxLength
                        }))
                    ]),
                    lastName: every([
                        required(),
                        length((context) => ({
                            minLength: context.minLength,
                            maxLength: context.maxLength
                        }))
                    ]),
                    birthYear: range((context) => ({
                        min: context.min,
                        max: context.max
                    }))
                }, {
                    message: 'The person must be valid'
                });

                // Create a person
                const person = {
                    firstName: 'Stanford',
                    lastName: 'Strickland',
                    birthYear: 1925
                };

                const result = validate(personValidator, person, {
                    objectProps: {
                        firstName: {
                            minLength: 5,
                            maxLength: 20
                        },
                        lastName: {
                            minLength: 8,
                            maxLength: 23
                        },
                        birthYear: {
                            min: 1900,
                            max: 2018
                        }
                    }
                });

                expect(result).toMatchObject({
                    objectProps: {
                        firstName: {
                            minLength: 5,
                            maxLength: 20
                        },
                        lastName: {
                            minLength: 8,
                            maxLength: 23
                        },
                        birthYear: {
                            min: 1900,
                            max: 2018
                        }
                    }
                });
            });

            it('result properties', () => {
                // Define the rules for first name, last name, and birthYear
                const personValidator = objectProps({
                    firstName: every([required(), length(2, 20)]),
                    lastName: every([required(), length(2, 20)]),
                    birthYear: range(1900, 2018)
                });

                // Create a person
                const person = {
                    firstName: 'Stanford',
                    lastName: 'Strickland',
                    birthYear: 1925
                };

                const result = validate(personValidator, person);

                expect(result).toMatchObject({
                    isValid: true,
                    value: person,
                    objectProps: {
                        firstName: {
                            isValid: true,
                            value: 'Stanford',
                            required: true,
                            minLength: 2,
                            maxLength: 20,
                            every: [
                                {
                                    isValid: true,
                                    value: 'Stanford',
                                    required: true
                                },
                                {
                                    isValid: true,
                                    value: 'Stanford',
                                    minLength: 2,
                                    maxLength: 20
                                }
                            ]
                        },
                        lastName: {
                            isValid: true,
                            value: 'Strickland',
                            required: true,
                            minLength: 2,
                            maxLength: 20,
                            every: [
                                {
                                    isValid: true,
                                    value: 'Strickland',
                                    required: true
                                },
                                {
                                    isValid: true,
                                    value: 'Strickland',
                                    minLength: 2,
                                    maxLength: 20
                                }
                            ]
                        },
                        birthYear: {
                            isValid: true,
                            value: 1925,
                            min: 1900,
                            max: 2018
                        }
                    }
                });
            });
        });

        it('advanced object validation', () => {
            // Define the rules for first name, last name, and birthYear
            const personPropsValidator = objectProps({
                firstName: every([
                    required(),
                    length(2, 20)
                ]),
                lastName: every([
                    required(),
                    length(2, 20)
                ]),
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

            const personValidator = every([
                required(),
                personPropsValidator,
                stanfordStricklandBornIn1925
            ]);

            // Create a person
            const person = {
                firstName: 'Stanford',
                lastName: 'Strickland',
                birthYear: 1925
            };

            const result = validate(personValidator, person);
            expect(result.isValid).toBe(true);
        });

        it('nested objects', () => {
            const personValidator = objectProps({
                name: every([required(), length(5, 40)]),
                address: objectProps({
                    street: every([required(), objectProps({
                        number: every([required(), range(1, 99999)]),
                        name: every([required(), length(2, 40)])
                    })]),
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

            const result = validate(personValidator, person);
            expect(result.isValid).toBe(true);
        });

        it('arrays of objects', () => {
            const personValidator = objectProps({
                name: every([required(), length(5, 40)]),
                addresses: arrayOf(
                    every([
                        required(),
                        objectProps({
                            street: every([required(), objectProps({
                                number: every([required(), range(1, 99999)]),
                                name: every([required(), length(2, 40)])
                            })]),
                            city: required(),
                            state: every([required(), length(2, 2)])
                        })
                    ])
                )
            });

            const person = {
                name: 'Marty McFly',
                addresses: [
                    {
                        street: {
                            number: 9303,
                            name: 'Lyon Drive'
                        },
                        city: 'Hill Valley',
                        state: 'CA'
                    },
                    null,
                    {
                        street: null,
                        city: 'Hill Valley',
                        state: 'CA'
                    }
                ]
            };

            const result = validate(personValidator, person);

            expect(result).toMatchObject({
                isValid: false,
                objectProps: expect.objectContaining({
                    addresses: expect.objectContaining({
                        isValid: false,
                        arrayOf: [
                            expect.objectContaining({
                                isValid: true,
                                value: expect.objectContaining({
                                    street: expect.objectContaining({
                                        number: 9303
                                    })
                                })
                            }),
                            expect.objectContaining({
                                isValid: false,
                                value: null
                            }),
                            expect.objectContaining({
                                isValid: false,
                                value: expect.objectContaining({
                                    street: null
                                })
                            })
                        ]
                    })
                })
            });
        });

        it('conventions', () => {
            const personValidator = [
                required(),
                {
                    name: [required(), length(5, 40)],
                    addresses: [required(), arrayOf([
                        required(),
                        {
                            street: [
                                required(),
                                {
                                    number: [required(), range(1, 99999)],
                                    name: [required(), length(2, 40)]
                                }
                            ],
                            city: required(),
                            state: [required(), length(2, 2)]
                        }
                    ])]
                }
            ];

            const person = {
                name: 'Stanford Strickland',
                address: {
                    city: 'Hill Valley',
                    state: 'CA'
                }
            };

            const result = validate(personValidator, person);
            expect(result.isValid).toBe(false);
        });
    });
});
