import expect from 'expect';
import minLength from '../src/minLength';

describe('minLength', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => minLength()).toThrow();
        });

        it('when props is a string', () => {
            expect(() => minLength('123')).toThrow();
        });

        it('when props is an object without a minLength', () => {
            expect(() => minLength({ min: 123 })).toThrow();
        });
    });

    describe('with a single props argument', () => {
        const validate = minLength({minLength: 3, message: 'Custom message'});
        const result = validate('123');

        it('uses the min prop', () => {
            expect(result.minLength).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = minLength(3, {message: 'Custom message'});
        const result = validate('123');

        it('sets the min prop', () => {
            expect(result.minLength).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('validates', () => {
        const validate = minLength(3);

        it('with the string length equal to the minLength, it is valid', () => {
            const result = validate('123');
            expect(result.isValid).toBe(true);
        });

        it('with the string length greater than the minLength, it is valid', () => {
            const result = validate('1234');
            expect(result.isValid).toBe(true);
        });

        it('with the string length less than the minLength, it is invalid', () => {
            const result = validate('12');
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
