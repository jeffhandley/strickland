import {some, required, minLength, maxLength} from '../src/strickland';

describe('some', () => {
    it('returns a validate function', () => {
        const validate = some();
        expect(validate).toBeInstanceOf(Function);
    });

    it('defaults to valid when there are no validators', () => {
        const validate = some();
        const result = validate();
        expect(result.isValid).toBe(true);
    });

    it('defaults to valid when validators is empty', () => {
        const validate = some([]);
        const result = validate();
        expect(result.isValid).toBe(true);
    });

    describe('validates', () => {
        const validate = some([
            required({message: 'Required'}),
            maxLength(4),
            minLength(2)
        ]);

        const value = '';
        const result = validate(value);

        it('returning a result object', () => {
            expect(result).toBeInstanceOf(Object);
        });

        it('returning a some array on the result', () => {
            expect(result.some).toBeInstanceOf(Array);
        });

        it('returning results for invalid validators and the first valid validator', () => {
            expect(result).toMatchObject({
                some: [
                    {isValid: false, message: 'Required'},
                    {isValid: true, maxLength: 4}
                ]
            });
        });

        it('returning a top-level isValid property (true when any result is valid)', () => {
            expect(result.isValid).toBe(true);
        });

        it('producing valid results', () => {
            const validResult = validate('ABC');
            expect(validResult).toMatchObject({
                isValid: true,
                some: [
                    {isValid: true, message: 'Required'}
                ]
            });
        });
    });

    describe('with nested rules arrays', () => {
        const validate = some([
            some([
                minLength(2),
                maxLength(4)
            ])
        ]);

        it('returns results in the shape of the rules', () => {
            const result = validate('A');

            expect(result).toMatchObject({
                some: [
                    {
                        isValid: true,
                        some: [
                            {isValid: false, minLength: 2},
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
                    isValid: false
                });
            }

            const validateWithResultProps = some([
                resultPropValidator({first: 'First'}),
                resultPropValidator({second: 'Second'}),
                some([
                    resultPropValidator({third: 'Third'}),
                    resultPropValidator({fourth: 'Fourth'}),
                    some([
                        resultPropValidator({fifth: 'Fifth'})
                    ])
                ])
            ]);

            const result = validateWithResultProps();

            expect(result).toMatchObject({
                isValid: false,
                first: 'First',
                second: 'Second',
                third: 'Third',
                fourth: 'Fourth',
                fifth: 'Fifth'
            });
        });
    });

    describe('passes props to the validators', () => {
        const validate = some([minLength(2)], {validatorProp: 'Validator'});
        const result = validate('AB', {validateProp: 'Validate'});

        it('from the validator definition', () => {
            expect(result).toMatchObject({
                validatorProp: 'Validator',
                some: [
                    {validatorProp: 'Validator', minLength: 2}
                ]
            });
        });

        it('from the validate function', () => {
            expect(result).toMatchObject({
                validateProp: 'Validate',
                some: [
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

            const validateWithMessage = some([(validator)]);
            const resultWithMessage = validateWithMessage('AB', {message: 'From validation'})

            expect(resultWithMessage.message).toBe('From the result');
        });
    });

    describe('given async validators', () => {
        it('returns a Promise if a validator returns a Promise', () => {
            const validate = some([
                () => Promise.resolve(true)
            ]);

            const result = validate();
            expect(result).toBeInstanceOf(Promise);
        });

        it('resolves results until a valid result is encountered', () => {
            const validate = some([
                () => ({isValid: false, first: 'First'}),
                () => Promise.resolve({isValid: false, second: 'Second'}),
                () => ({isValid: true, third: 'Third'}),
                () => Promise.resolve({isValid: false, fourth: 'Fourth'}),
                () => Promise.resolve({isValid: true, fifth: 'Fifth'})
            ]);

            const result = validate(null, {fourth: 'Not validated', fifth: 'Not validated'});
            return expect(result).resolves.toMatchObject({
                first: 'First',
                second: 'Second',
                third: 'Third',
                fourth: 'Not validated',
                fifth: 'Not validated'
            });
        });

        describe('resolves results', () => {
            it('that resolve as true', () => {
                const validate = some([
                    () => Promise.resolve(true)
                ]);

                const result = validate('some with a promise');
                return expect(result).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as a valid result object', () => {
                const validate = some([
                    () => Promise.resolve({isValid: true})
                ]);

                const result = validate();
                return expect(result).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as false', () => {
                const validate = some([
                    () => Promise.resolve(false)
                ]);

                const result = validate();
                return expect(result).resolves.toMatchObject({isValid: false});
            });

            it('that resolve as an invalid result object', () => {
                const validate = some([
                    () => Promise.resolve({isValid: false})
                ]);

                const result = validate();
                return expect(result).resolves.toMatchObject({isValid: false});
            });

            it('recursively', () => {
                const validate = some([
                    () => Promise.resolve(
                        Promise.resolve(
                            Promise.resolve({
                                isValid: true,
                                recursively: 'Yes!'
                            })
                        )
                    ),
                    some([
                        () => Promise.resolve(
                            Promise.resolve(true)
                        ),
                        some([
                            () => Promise.resolve(
                                Promise.resolve({
                                    isValid: true,
                                    inNestedValidators: 'Yep'
                                })
                            )
                        ])
                    ])
                ]);

                const result = validate();

                return expect(result).resolves.toMatchObject({
                    isValid: true,
                    recursively: 'Yes!',
                    inNestedValidators: 'Yep'
                });
            });

            it('after the first promise', () => {
                const validate = some([
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
            const validate = some([
                () => Promise.resolve(true)
            ]);

            const result = validate('ABC');
            return expect(result).resolves.toMatchObject({value: 'ABC'});
        });

        it('puts validate props on the resolved result', () => {
            const validate = some([
                () => Promise.resolve(true)
            ]);

            const result = validate('ABC', {message: 'Message'});
            return expect(result).resolves.toMatchObject({message: 'Message'});
        });
    });
});
