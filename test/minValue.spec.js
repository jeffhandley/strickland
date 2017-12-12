import expect from 'expect';
import minValue from '../src/minValue';

describe('minValue', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => minValue()).toThrow();
        });

        it('when props is a string', () => {
            expect(() => minValue('123')).toThrow();
        });

        it('when props is an object without a minValue', () => {
            expect(() => minValue({ min: 123 })).toThrow();
        });
    });

    describe('with a number for props', () => {
        it('sets the minValue prop', () => {
            const validate = minValue(3);
            const result = validate(3);

            expect(result.minValue).toBe(3);
        });
    });

    describe('validates', () => {
        const validate = minValue(3);

        it('with the value equal to the minValue, it is valid', () => {
            const result = validate(3);
            expect(result.isValid).toBe(true);
        });

        it('with the value greater than the minValue, it is valid', () => {
            const result = validate(4);
            expect(result.isValid).toBe(true);
        });

        it('with the value less than the minValue, it is invalid', () => {
            const result = validate(2);
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

        it('with a string value equal to the minValue, it is valid', () => {
            const result = validate('3');
            expect(result.isValid).toBe(true);
        });

        it('with a string value greater than the minValue, it is valid', () => {
            const result = validate('4');
            expect(result.isValid).toBe(true);
        });

        it('with a string value less than the minValue, it is invalid', () => {
            const result = validate('2');
            expect(result.isValid).toBe(false);
        });
    });
});
