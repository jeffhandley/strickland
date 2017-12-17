import expect from 'expect';
import maxLength from '../src/maxLength';

describe('maxLength', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => maxLength()).toThrow();
        });

        it('when props is a string', () => {
            expect(() => maxLength('123')).toThrow();
        });

        it('when props is an object without a maxLength', () => {
            expect(() => maxLength({ min: 123 })).toThrow();
        });
    });

    describe('with a single props argument', () => {
        const validate = maxLength({maxLength: 3, message: 'Custom message'});
        const result = validate('123');

        it('uses the min prop', () => {
            expect(result.maxLength).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = maxLength(3, {message: 'Custom message'});
        const result = validate('123');

        it('sets the min prop', () => {
            expect(result.maxLength).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('validates', () => {
        const validate = maxLength(3);

        it('with the string length equal to the maxLength, it is valid', () => {
            const result = validate('123');
            expect(result.isValid).toBe(true);
        });

        it('with the string length less than the maxLength, it is valid', () => {
            const result = validate('12');
            expect(result.isValid).toBe(true);
        });

        it('with the string length greater than the maxLength, it is invalid', () => {
            const result = validate('1234');
            expect(result.isValid).toBe(false);
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
