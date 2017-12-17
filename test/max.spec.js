import expect from 'expect';
import max from '../src/max';

describe('max', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => max()).toThrow();
        });

        it('when props is a string', () => {
            expect(() => max('123')).toThrow();
        });

        it('when props is an object without a max', () => {
            expect(() => max({ max: 'Custom message' })).toThrow();
        });
    });

    describe('with a single props argument', () => {
        const validate = max({max: 5, message: 'Custom message'});
        const result = validate(4);

        it('uses the min prop', () => {
            expect(result.max).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = max(5, {message: 'Custom message'});
        const result = validate(4);

        it('sets the min prop', () => {
            expect(result.max).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('validates', () => {
        const validate = max(3);

        it('with the value equal to the max, it is valid', () => {
            const result = validate(3);
            expect(result.isValid).toBe(true);
        });

        it('with the value less than the max, it is valid', () => {
            const result = validate(2);
            expect(result.isValid).toBe(true);
        });

        it('with the value greater than the max, it is invalid', () => {
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

        it('with a string value equal to the max, it is valid', () => {
            const result = validate('3');
            expect(result.isValid).toBe(true);
        });

        it('with a string value less than the max, it is valid', () => {
            const result = validate('2');
            expect(result.isValid).toBe(true);
        });

        it('with a string value greater than the max, it is invalid', () => {
            const result = validate('4');
            expect(result.isValid).toBe(false);
        });
    });
});
