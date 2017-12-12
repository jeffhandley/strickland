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

    describe('with a number for props', () => {
        it('sets the maxLength prop', () => {
            const validate = maxLength(3);
            const result = validate('123');

            expect(result.maxLength).toBe(3);
        });
    });

    describe('validates', () => {
        const validate = maxLength(3);

        it('with the string length equal to the minLength, it is valid', () => {
            const result = validate('123');
            expect(result.isValid).toBe(true);
        });

        it('with the string length less than the minLength, it is valid', () => {
            const result = validate('12');
            expect(result.isValid).toBe(true);
        });

        it('with the string length greater than the minLength, it is invalid', () => {
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
