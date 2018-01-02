import {each, required, minLength, maxLength} from '../src/strickland';

describe('each', () => {
    it('returns a validate function', () => {
        const validate = each();
        expect(validate).toBeInstanceOf(Function);
    });

    it('defaults to valid when there are no validators', () => {
        const validate = each();
        const result = validate();
        expect(result.isValid).toBe(true);
    });

    it('defaults to valid when validators is empty', () => {
        const validate = each([]);
        const result = validate();
        expect(result.isValid).toBe(true);
    });

    describe('validates', () => {
        const validate = each([
            required({message: 'Required'}),
            minLength(2),
            maxLength(4)
        ]);

        const value = 'A';
        const result = validate(value);

        it('returning a result object', () => {
            expect(result).toBeInstanceOf(Object);
        });

        it('returning an each array on the result', () => {
            expect(result.each).toBeInstanceOf(Array);
        });

        it('returning results for each validator (including after invalid results)', () => {
            expect(result).toMatchObject({
                each: [
                    {isValid: true, message: 'Required'},
                    {isValid: false, minLength: 2},
                    {isValid: true, maxLength: 4}
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
                each: [
                    {isValid: true, message: 'Required'},
                    {isValid: true, minLength: 2},
                    {isValid: true, maxLength: 4}
                ]
            });
        });
    });

    describe('with nested rules arrays', () => {
        const validate = each([
            required({message: 'Required'}),
            each([
                minLength(2),
                maxLength(4)
            ])
        ]);

        it('returns results in the shape of the rules', () => {
            const result = validate('ABC');

            expect(result).toMatchObject({
                each: [
                    {isValid: true, message: 'Required'},
                    {
                        isValid: true,
                        each: [
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

            const validateWithResultProps = each([
                resultPropValidator({first: 'First'}),
                resultPropValidator({second: 'Second'}),
                each([
                    resultPropValidator({third: 'Third'}),
                    resultPropValidator({fourth: 'Fourth'}),
                    each([
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
        const validate = each([required({message: 'Required'}), minLength(2)], {validatorProp: 'Validator'});
        const result = validate('AB', {validateProp: 'Validate'});

        it('from the validator definition', () => {
            expect(result).toMatchObject({
                validatorProp: 'Validator',
                each: [
                    {validatorProp: 'Validator', message: 'Required'},
                    {validatorProp: 'Validator', minLength: 2}
                ]
            });
        });

        it('from the validate function', () => {
            expect(result).toMatchObject({
                validateProp: 'Validate',
                each: [
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

            const validateWithMessage = each([(validator)]);
            const resultWithMessage = validateWithMessage('AB', {message: 'From validation'})

            expect(resultWithMessage.message).toBe('From the result');
        });
    });

    describe('given async validators', () => {
        describe('returns a validateAsync result prop', () => {
            it('that is a Promise', () => {
                const validate = each([
                    () => Promise.resolve(true)
                ]);

                const result = validate();
                expect(result.validateAsync).toBeInstanceOf(Promise);
            });

            it('with exclusively nested results', () => {
                const validateNested = each([
                    each([
                        () => Promise.resolve(true)
                    ])
                ]);

                const nestedResult = validateNested('ABC');

                return expect(nestedResult.validateAsync).resolves.toMatchObject({
                    isValid: true,
                    each: [
                        {
                            isValid: true,
                            each: [{isValid: true}]
                        }
                    ]
                });
            });
        });

        describe('resolves results', () => {
            it('resolves each result, even when some are invalid', () => {
                const validate = each([
                    () => ({isValid: false, first: 'First'}),
                    () => Promise.resolve({isValid: false, second: 'Second'}),
                    () => ({isValid: false, third: 'Third'}),
                    () => Promise.resolve({isValid: false, fourth: 'Fourth'}),
                    () => Promise.resolve({isValid: true, fifth: 'Fifth'})
                ]);

                const result = validate();

                return expect(result.validateAsync).resolves.toMatchObject({
                    first: 'First',
                    second: 'Second',
                    third: 'Third',
                    fourth: 'Fourth',
                    fifth: 'Fifth'
                });
            });

            it('that resolve as true', () => {
                const validate = each([
                    () => Promise.resolve(true)
                ]);

                const result = validate();
                return expect(result.validateAsync).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as a valid result object', () => {
                const validate = each([
                    () => Promise.resolve({isValid: true})
                ]);

                const result = validate();
                return expect(result.validateAsync).resolves.toMatchObject({isValid: true});
            });

            it('that resolve as false', () => {
                const validate = each([
                    () => Promise.resolve(false)
                ]);

                const result = validate();
                return expect(result.validateAsync).resolves.toMatchObject({isValid: false});
            });

            it('that resolve as an invalid result object', () => {
                const validate = each([
                    () => Promise.resolve({isValid: false})
                ]);

                const result = validate();
                return expect(result.validateAsync).resolves.toMatchObject({isValid: false});
            });

            it('recursively', () => {
                const validate = each([
                    () => Promise.resolve(
                        Promise.resolve(
                            Promise.resolve({
                                isValid: true,
                                recursively: 'Yes!'
                            })
                        )
                    ),
                    each([
                        () => Promise.resolve(
                            Promise.resolve(true)
                        ),
                        each([
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

                return expect(result.validateAsync).resolves.toMatchObject({
                    isValid: true,
                    recursively: 'Yes!',
                    inNestedValidators: 'Yep'
                });
            });

            it('puts the value on the resolved result', () => {
                const validate = each([
                    () => Promise.resolve(true)
                ]);

                const result = validate('ABC');
                return expect(result.validateAsync).resolves.toMatchObject({value: 'ABC'});
            });

            it('puts validate props on the resolved result', () => {
                const validate = each([
                    () => Promise.resolve(true)
                ]);

                const result = validate('ABC', {message: 'Message'});
                return expect(result.validateAsync).resolves.toMatchObject({message: 'Message'});
            });
        });

        describe('returns a partial result object', () => {
            const validate = each([
                () => ({isValid: true, first: 'First'}),
                () => Promise.resolve({isValid: true, second: 'Second'}),
                each([
                    () => ({isValid: true, third: 'Third'}),
                    () => Promise.resolve({isValid: true, fourth: 'Fourth'}),
                    () => ({isValid: true, fifth: 'Fifth'})
                ]),
                () => ({isValid: true, sixth: 'Sixth'})
            ]);

            const result = validate('ABC');

            it('that is marked as not valid', () => {
                expect(result.isValid).toBe(false);
            });

            it('with sync results in place and Promise results where expected', () => {
                expect(result).toMatchObject({
                    first: 'First',
                    third: 'Third',
                    fifth: 'Fifth',
                    sixth: 'Sixth',
                    each: [
                        {first: 'First'},
                        {validateAsync: Promise.prototype},
                        {
                            third: 'Third',
                            fifth: 'Fifth',
                            each: [
                                {third: 'Third'},
                                {validateAsync: Promise.prototype},
                                {fifth: 'Fifth'}
                            ]
                        },
                        {sixth: 'Sixth'}
                    ]
                });
            });

            it('with individual validator promises that will finish their results', () => {
                return expect(result.each[2].each[1].validateAsync).resolves.toMatchObject({
                    isValid: true,
                    fourth: 'Fourth'
                });
            });
        });
    });
});
