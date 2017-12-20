import expect from 'expect';
import deepFreeze from 'deep-freeze';
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
    });

    describe('with props', () => {
        describe('includes a required prop on the result', () => {
            const validate = required();

            it('when valid', () => {
                const result = validate('Valid');
                expect(result.required).toBe(true);
            });

            it('when invalid', () => {
                const result = validate('');
                expect(result.required).toBe(true);
            });
        });

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

    describe('with props passed into validation', () => {
        it('allows message to be specified at time of validation', () => {
            const validate = required();
            const result = validate('', {message: 'The value is required'});

            expect(result).toMatchObject({
                isValid: false,
                message: 'The value is required'
            });
        });
    });

    describe('does not mutate props', () => {
        it('when a props argument is used', () => {
            const props = {message: 'Custom message'};
            deepFreeze(props);

            expect(() => required(props)('value')).not.toThrow();
        });
    });
});
