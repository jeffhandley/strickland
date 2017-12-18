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
            expect(() => min({message: 'Custom message'})).toThrow();
        });

        it('when props is an object with a non-numeric min', () => {
            expect(() => min({min: 'Custom message'})).toThrow();
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

    it('returns the value on the result', () => {
        const validate = min(3);
        const result = validate(4);

        expect(result.value).toBe(4);
    });

    describe('returns the parsedValue on the result', () => {
        const validate = min(3);

        it('when the value is a number', () => {
            const result = validate(4);
            expect(result.parsedValue).toBe(4);
        });

        it('when the value is a string', () => {
            const result = validate('4');
            expect(result.parsedValue).toBe(4);
        });

        it('when the value is null', () => {
            const result = validate(null);
            expect(result.parsedValue).toBe(null);
        });

        it('when the value is an empty string', () => {
            const result = validate('');
            expect(result.parsedValue).toBe('');
        });

        it('when the value is 0 as a string', () => {
            const result = validate('0');
            expect(result.parsedValue).toBe(0);
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
