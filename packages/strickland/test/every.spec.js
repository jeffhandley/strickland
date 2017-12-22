import {every, required, minLength, maxLength} from '../src/strickland';

describe('every', () => {
    it('returns a validate function', () => {
        const validate = every();
        expect(validate).toBeInstanceOf(Function);
    });

    it('defaults to valid when there are no validators', () => {
        const validate = every();
        const result = validate();
        expect(result.isValid).toBe(true);
    });

    it('defaults to valid when validators is empty', () => {
        const validate = every([]);
        const result = validate();
        expect(result.isValid).toBe(true);
    });

    describe('validates', () => {
        const validate = every([required({message: 'Required'}), minLength(2), maxLength(4)]);
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

    describe('passes props to the validators', () => {
        const validate = every([required({message: 'Required'}), minLength(2)], {validatorProp: 'Validator'});
        const result = validate('AB', {validateProp: 'Validate'});

        it('from the validator definition', () => {
            expect(result).toMatchObject({
                validatorProp: 'Validator',
                every: [
                    {validatorProp: 'Validator', message: 'Required'},
                    {validatorProp: 'Validator', minLength: 2}
                ]
            });
        });

        it('from the validate function', () => {
            expect(result).toMatchObject({
                validateProp: 'Validate',
                every: [
                    {validateProp: 'Validate', message: 'Required'},
                    {validateProp: 'Validate', minLength: 2}
                ]
            });
        });

        it('overrides validation props with result props', () => {
            function validator() {
                return {
                    isValid: true,
                    message: 'From the result'
                };
            }

            const validateWithMessage = every([(validator)]);
            const resultWithMessage = validateWithMessage('AB', {message: 'From validation'})

            expect(resultWithMessage.message).toBe('From the result');
        });
    });

    describe('given async validators', () => {
        it('returns a Promise if a validator returns a Promise', () => {
            const validate = every([
                () => Promise.resolve(true)
            ]);

            const result = validate();
            expect(result).toBeInstanceOf(Promise);
        });

        it('returns a resolved result if an invalid result appears before hitting a Promise', () => {
            const validate = every([
                () => ({isValid: false, first: 'First'}),
                () => Promise.resolve(true)
            ]);

            const result = validate();
            expect(result).toMatchObject({
                isValid: false,
                first: 'First'
            });
        });

        describe('resolves results', () => {
            it('that resolve as true', () => {
                const validate = every([
                    () => Promise.resolve(true)
                ]);

                const result = validate('Every with a promise');
                return expect(result).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as a valid result object', () => {
                const validate = every([
                    () => Promise.resolve({isValid: true})
                ]);

                const result = validate();
                return expect(result).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as false', () => {
                const validate = every([
                    () => Promise.resolve(false)
                ]);

                const result = validate();
                return expect(result).resolves.toMatchObject({isValid: false});
            });

            it('that resolve as an invalid result object', () => {
                const validate = every([
                    () => Promise.resolve({isValid: false})
                ]);

                const result = validate();
                return expect(result).resolves.toMatchObject({isValid: false});
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
                                    inNestedEveryValidators: 'Yep'
                                })
                            )
                        ])
                    ])
                ]);

                const result = validate();
                return expect(result).resolves.toMatchObject({isValid: true, recursively: 'Yes!', inNestedEveryValidators: 'Yep'});
            });

            it('after the first promise', () => {
                const validate = every([
                    () => Promise.resolve({isValid: true, first: 'First'}),
                    () => ({isValid: true, second: 'Second'})
                ]);

                const result = validate();
                return expect(result).resolves.toMatchObject({
                    isValid: true,
                    first: 'First',
                    second: 'Second'
                });
            });
        });

        it('puts the value on the resolved result', () => {
            const validate = every([
                () => Promise.resolve(true)
            ]);

            const result = validate('ABC');
            return expect(result).resolves.toMatchObject({value: 'ABC'});
        });

        it('puts validate props on the resolved result', () => {
            const validate = every([
                () => Promise.resolve(true)
            ]);

            const result = validate('ABC', {message: 'Message'});
            return expect(result).resolves.toMatchObject({message: 'Message'});
        });
    });
});
