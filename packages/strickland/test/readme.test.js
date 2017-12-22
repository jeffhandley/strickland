import validate, {props, required, minLength, maxLength, length, range, every, each, some} from '../src/strickland';

describe('readme', () => {
    it('performing validation', () => {
        function letterA(value) {
            return (value === 'A');
        }

        const result = validate(letterA, 'B');

        expect(result).toMatchObject({
            isValid: false,
            value: 'B'
        });
    });

    it('creating configurable validators', () => {
        function letter(letterProp) {
            return function validateLetter(value) {
                return (value === letterProp);
            }
        }

        const result = validate(letter('B'), 'B');

        expect(result).toMatchObject({
            isValid: true,
            value: 'B'
        });
    });

    it('validation messages', () => {
        function letter(letterProp) {
            return function validateLetter(value) {
                return {
                    isValid: (value === letter),
                    message: `Must match the letter ${letterProp}`
                };
            }
        }

        const result = validate(letter('A'), 'B');

        expect(result).toMatchObject({
            isValid: false,
            value: 'B',
            message: 'Must match the letter A'
        });
    });

    it('validation-time props', () => {
        function letter(letterProp, validatorProps) {
            if (typeof letterProp === 'object') {
                validatorProps = letterProp;

            } else {
                validatorProps = {
                    ...validatorProps,
                    letter: letterProp
                };
            }

            return function validateLetter(value, validationProps) {
                validationProps = {
                    ...validatorProps,
                    ...validationProps
                };

                return {
                    message: `Must match the letter ${letter}`,
                    ...validationProps,
                    isValid: (value === letter)
                };
            }
        }

        const secondMatchesFirst = letter({message: 'The second value must match the first value'});

        const first = 'M';
        const second = 'N';

        const result = validate(secondMatchesFirst, second, {letter: first});

        expect(result).toMatchObject({
            isValid: false,
            value: 'N',
            letter: 'M',
            message: 'The second value must match the first value'
        });
    });

    it('composing validators', () => {
        const mustExistWithLength5 = every([required(), minLength(5)]);
        const result = validate(mustExistWithLength5, '1234', {message: 'Must have a length of at least 5'});

        expect(result).toMatchObject({
            isValid: false,
            value: '1234',
            required: true,
            minLength: 5,
            message: 'Must have a length of at least 5'
        });
    });

    it('every', () => {
        const mustExistWithLength5 = every([
            required({message: 'Required'}),
            minLength(5, {message: 'Must have a length of at least 5'}),
            maxLength(10, {message: 'Must have a length no greater than 10'})
        ]);

        const result = validate(mustExistWithLength5, '1234');

        expect(result).toMatchObject({
            isValid: false,
            value: '1234',
            required: true,
            minLength: 5,
            message: 'Must have a length of at least 5',
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
                    message: 'Must have a length of at least 5'
                }
            ]
        });
    });

    it('each', () => {
        const mustExistWithLength5 = each([
            required({message: 'Required'}),
            minLength(5, {message: 'Must have a length of at least 5'}),
            maxLength(10, {message: 'Must have a length no greater than 10'})
        ]);

        const result = validate(mustExistWithLength5, '1234');

        expect(result).toMatchObject({
            isValid: false,
            value: '1234',
            required: true,
            minLength: 5,
            message: 'Must have a length no greater than 10',
            each: [
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
                    message: 'Must have a length of at least 5'
                },
                {
                    isValid: true,
                    value: '1234',
                    maxLength: 10,
                    message: 'Must have a length no greater than 10'
                }
            ]
        });
    });

    it('some', () => {
        const mustExistWithLength5 = some([
            required({message: 'Required'}),
            maxLength(10, {message: 'Must have a length no greater than 10'}),
            minLength(5, {message: 'Must have a length of at least 5'})
        ]);
        const result = validate(mustExistWithLength5, '');

        expect(result).toMatchObject({
            isValid: true,
            value: '',
            required: true,
            maxLength: 10,
            message: 'Must have a length no greater than 10',
            some: [
                {
                    isValid: false,
                    value: '',
                    required: true,
                    message: 'Required'
                },
                {
                    isValid: true,
                    value: '',
                    maxLength: 10,
                    message: 'Must have a length no greater than 10'
                }
            ]
        })
    });

    it('validating objects', () => {
        // Define the rules for validating first name, last name, and birthYear
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

            if (person.firstName === 'Stanford' && person.lastName === 'Strickland') {
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

        expect(result).toMatchObject({
            isValid: true,
            required: true,
            every: [
                {isValid: true, required: true},
                {
                    isValid: true,
                    props: {
                        firstName: {isValid: true},
                        lastName: {isValid: true},
                        birthYear: {isValid: true}
                    }
                },
                {isValid: true}
            ]
        });
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

    describe('async validators', () => {
        function usernameIsAvailable(username) {
            if (!username) {
                return true;
            }

            return new Promise((resolve) => {
                if (username === 'marty') {
                    resolve({
                        isValid: false,
                        message: `The username "${username}" is not available`
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
                    message: 'The username "marty" is not available'
                });
            });
        });

        it('async validator arrays and objects', () => {
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

            return validate(validatePerson, person).then((result) => {
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
                            message: 'The username "marty" is not available'
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
    });
});
