import deepFreeze from 'deep-freeze';
import length from '../src/length';

describe('length', () => {
    describe('with a single props argument', () => {
        const validate = length({minLength: 3, maxLength: 5, message: 'Custom message', isValid: false});
        const result = validate('1234');

        it('uses the min prop', () => {
            expect(result.minLength).toBe(3);
        });

        it('uses the max prop', () => {
            expect(result.maxLength).toBe(5);
        });

        it('spreads the other props onto the result', () => {
            expect(result.message).toBe('Custom message');
        });

        it('overrides the isValid prop with the validation result', () => {
            expect(result.isValid).toBe(true);
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = length(3, {maxLength: 5, message: 'Custom message', isValid: true});
        const result = validate('12');

        it('sets the min prop', () => {
            expect(result.minLength).toBe(3);
        });

        it('uses the max prop', () => {
            expect(result.maxLength).toBe(5);
        });

        it('spreads the other props onto the result', () => {
            expect(result.message).toBe('Custom message');
        });

        it('overrides the isValid prop with the validation result', () => {
            expect(result.isValid).toBe(false);
        });
    });

    describe('with the first and second arguments as numbers and the third as an object', () => {
        const validate = length(3, 5, {message: 'Custom message', isValid: true});
        const result = validate('12');

        it('sets the min prop', () => {
            expect(result.minLength).toBe(3);
        });

        it('sets the max prop', () => {
            expect(result.maxLength).toBe(5);
        });

        it('spreads the other props onto the result', () => {
            expect(result.message).toBe('Custom message');
        });

        it('overrides the isValid prop with the validation result', () => {
            expect(result.isValid).toBe(false);
        });
    });

    describe('returns the length on the result', () => {
        const validate = length(3, 5);

        it('when the value is a string', () => {
            const result = validate('1234');
            expect(result.length).toBe(4);
        });

        it('when the value is null', () => {
            const result = validate(null);
            expect(result.length).toBe(0);
        });

        it('when the value is an empty string', () => {
            const result = validate('');
            expect(result.length).toBe(0);
        });

        it('when the value is 0 as a string', () => {
            const result = validate('0');
            expect(result.length).toBe(1);
        });

        it('when the value has leading spaces', () => {
            const result = validate('   1234');
            expect(result.length).toBe(7);
        });

        it('when the value has trailing spaces', () => {
            const result = validate('1234   ');
            expect(result.length).toBe(7);
        });

        it('when the value has leading and trailing spaces', () => {
            const result = validate('   1234   ');
            expect(result.length).toBe(10);
        });
    });

    const validates = (description, validate) => describe(description, () => {
        describe('validates', () => {
            it('with the length equal to the min, it is valid', () => {
                const result = validate('123');
                expect(result.isValid).toBe(true);
            });

            it('with the length equal to the max, it is valid', () => {
                const result = validate('12345');
                expect(result.isValid).toBe(true);
            });

            it('with the length greater than the min and less than the max, it is valid', () => {
                const result = validate('1234');
                expect(result.isValid).toBe(true);
            });

            it('with the length less than the min, it is invalid', () => {
                const result = validate('12');
                expect(result.isValid).toBe(false);
            });

            it('with the length greater than the max, it is invalid', () => {
                const result = validate('123456');
                expect(result.isValid).toBe(false);
            });

            it('with an empty string, it is valid', () => {
                const result = validate('');
                expect(result.isValid).toBe(true);
            });

            it('with a null value, it is valid', () => {
                const result = validate(null);
                expect(result.isValid).toBe(true);
            });

            it('with an undefined value, it is valid', () => {
                const result = validate();
                expect(result.isValid).toBe(true);
            });
        });
    });

    validates('with numeric arguments', length(3, 5));
    validates('with a props argument', length({minLength: 3, maxLength: 5}));
    validates('with a numeric min and props', length(3, {maxLength: 5}));
    validates('with numeric min and max plus props', length(3, 5, {other: 'other'}));

    describe('does not mutate props', () => {
        it('when a single props argument is used', () => {
            const props = {minLength: 3, maxLength: 5};
            deepFreeze(props);

            expect(() => length(props)('1234')).not.toThrow();
        });

        it('when a min length and props are used', () => {
            const props = {maxLength: 5, message: 'Custom message'};
            deepFreeze(props);

            expect(() => length(3, props)('1234')).not.toThrow();
        });

        it('when min and max values and props are used', () => {
            const props = {message: 'Custom message'};
            deepFreeze(props);

            expect(() => length(3, 5, props)('1234')).not.toThrow();
        });
    });
});
