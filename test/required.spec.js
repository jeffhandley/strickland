import expect from 'expect';
import required from '../src/required';

describe('required', () => {
    describe('validation', () => {
        const validate = required();

        it('is not valid for null', () => {
            const result = validate(null);
            expect(result.isValid).toBe(false);
        });

        it('is not valid for undefined', () => {
            let notDefined;
            const result = validate(notDefined);
            expect(result.isValid).toBe(false);
        });

        it('is not valid for an empty string', () => {
            const result = validate('');
            expect(result.isValid).toBe(false);
        });

        it('is valid for non-empty strings', () => {
            const result = validate('not empty');
            expect(result.isValid).toBe(true);
        });

        it('is valid for the number 0 (because 0 is indeed a supplied number)', () => {
            const result = validate(0);
            expect(result.isValid).toBe(true);
        });

        it('is valid for the number 1', () => {
            const result = validate(1);
            expect(result.isValid).toBe(true);
        });

        it('is valid for boolean true', () => {
            const result = validate(true);
            expect(result.isValid).toBe(true);
        });

        it('is not valid for boolean false (supporting scenarios like required checkboxes)', () => {
            const result = validate(false);
            expect(result.isValid).toBe(false);
        });

        it('trims string values so that an all spaces value is not valid', () => {
            const result = validate('    ');
            expect(result.isValid).toBe(false);
        });

        describe('exposes values on the result object', () => {
            it('for the original value', () => {
                const result = validate(' Original ');
                expect(result.value).toBe(' Original ');
            });

            it('for the parsed (trimmed) value', () => {
                const result = validate(' Original ');
                expect(result.parsedValue).toBe('Original');
            });
        });
    });

    describe('with props', () => {
        describe('passes props though to the result', () => {
            const validate = required({message: 'Required'})

            it('when valid', () => {
                const result = validate('Valid');
                expect(result.message).toBe('Required');
            });

            it('when invalid', () => {
                const result = validate();
                expect(result.message).toBe('Required');
            });
        });

        describe('overrides isValid prop with the validation result', () => {
            it('when valid', () => {
                const validate = required({isValid: false});
                const result = validate('Valid');
                expect(result.isValid).toBe(true);
            });

            it('when invalid', () => {
                const validate = required({isValid: true});
                const result = validate();
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('value parsing can be overridden with a parseValue prop', () => {
        it('affecting validity to make an invalid value valid', () => {
            const parseValue = () => 'Valid';
            const validate = required({parseValue});

            const result = validate('');
            expect(result.isValid).toBe(true);
        });

        it('affecting validity to make a valid value invalid', () => {
            const parseValue = () => '';
            const validate = required({parseValue});

            const result = validate('Valid');
            expect(result.isValid).toBe(false);
        });

        it('with the original value supplied to the parseValue function', () => {
            let suppliedValue;

            function parseValue(value) {
                suppliedValue = value;
                return value;
            }

            const validate = required({parseValue});
            const result = validate('Original');

            expect(suppliedValue).toBe('Original');
        });

        it('with the parsed value exposed as the parsedValue prop', () => {
            const parseValue = (value) => 'Parsed: ' + value;
            const validate = required({parseValue});

            const result = validate('Value');
            expect(result.parsedValue).toBe('Parsed: Value');
        });

        it('bypassing string trimming', () => {
            const parseValue = (value) => value;
            const validate = required({parseValue});

            const result = validate(' ');
            expect(result.parsedValue).toBe(' ');
        });

        describe('converting a value', () => {
            it('from null to a string validates the string', () => {
                const parseValue = () => 'Valid';
                const validate = required({parseValue});

                const result = validate(null);
                expect(result.isValid).toBe(true);
            });

            describe('from a string to a boolean validates the boolean', () => {
                it('that is valid', () => {
                    const parseValue = () => true;
                    const validate = required({parseValue});

                    const result = validate('   ');
                    expect(result.isValid).toBe(true);
                });

                it('that is invalid', () => {
                    const parseValue = () => false;
                    const validate = required({parseValue});

                    const result = validate('   ');
                    expect(result.isValid).toBe(false);
                });
            });

            it('from a string to null', () => {
                const parseValue = () => null;
                const validate = required({parseValue});

                const result = validate('Valid');
                expect(result.isValid).toBe(false);
            });

            it('from a string to undefined', () => {
                const parseValue = () => {};
                const validate = required({parseValue});

                const result = validate('Valid');
                expect(result.isValid).toBe(false);
            });

            it('from a string to a number', () => {
                const parseValue = () => 0;
                const validate = required({parseValue});

                const result = validate('');
                expect(result.isValid).toBe(true);
            });
        });
    });
});
