import expect from 'expect';
import maxValue from '../src/maxValue';

describe('maxValue', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => maxValue()).toThrow();
        });

        it('when props is a string', () => {
            expect(() => maxValue('123')).toThrow();
        });

        it('when props is an object without a maxValue', () => {
            expect(() => maxValue({ min: 123 })).toThrow();
        });
    });

    describe('with a number for props', () => {
        it('sets the maxValue prop', () => {
            const validate = maxValue(3);
            const result = validate(3);

            expect(result.maxValue).toBe(3);
        });
    });

    describe('validates', () => {
        const validate = maxValue(3);

        it('with the value equal to the maxValue, it is valid', () => {
            const result = validate(3);
            expect(result.isValid).toBe(true);
        });

        it('with the value less than the maxValue, it is valid', () => {
            const result = validate(2);
            expect(result.isValid).toBe(true);
        });

        it('with the value greater than the maxValue, it is invalid', () => {
            const result = validate(4);
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

        it('with a string value equal to the maxValue, it is valid', () => {
            const result = validate('3');
            expect(result.isValid).toBe(true);
        });

        it('with a string value less than the maxValue, it is valid', () => {
            const result = validate('2');
            expect(result.isValid).toBe(true);
        });

        it('with a string value greater than the maxValue, it is invalid', () => {
            const result = validate('4');
            expect(result.isValid).toBe(false);
        });
    });
});
