import expect from 'expect';
import min from '../src/min';

describe('min', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => min()).toThrow();
        });

        it('when props is a string', () => {
            expect(() => min('123')).toThrow();
        });

        it('when props is an object without a min', () => {
            expect(() => min({ message: 'Custom message' })).toThrow();
        });
    });

    describe('with a single props argument', () => {
        const validate = min({min: 3, message: 'Custom message'});
        const result = validate(4);

        it('uses the min prop', () => {
            expect(result.min).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = min(3, {message: 'Custom message'});
        const result = validate(4);

        it('sets the min prop', () => {
            expect(result.min).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('validates', () => {
        const validate = min(3);

        it('with the value equal to the min, it is valid', () => {
            const result = validate(3);
            expect(result.isValid).toBe(true);
        });

        it('with the value greater than the min, it is valid', () => {
            const result = validate(4);
            expect(result.isValid).toBe(true);
        });

        it('with the value less than the min, it is invalid', () => {
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

        it('with a string value equal to the min, it is valid', () => {
            const result = validate('3');
            expect(result.isValid).toBe(true);
        });

        it('with a string value greater than the min, it is valid', () => {
            const result = validate('4');
            expect(result.isValid).toBe(true);
        });

        it('with a string value less than the min, it is invalid', () => {
            const result = validate('2');
            expect(result.isValid).toBe(false);
        });
    });
});
