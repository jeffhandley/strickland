import expect from 'expect';
import deepFreeze from 'deep-freeze';
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
    });

    describe('with props passed into validation', () => {
        it('allows the min value to be specified at time of validation', () => {
            const validatorProps = {min: 6};
            const validate = min(validatorProps);
            const result = validate(5, {min: 5});

            expect(result).toMatchObject({
                isValid: true,
                min: 5
            });
        });
    });

    describe('does not mutate props', () => {
        it('when a single props argument is used', () => {
            const props = {min: 5};
            deepFreeze(props);

            expect(() => min(props)(5)).not.toThrow();
        });

        it('when a min value and props are used', () => {
            const props = {message: 'Custom message'};
            deepFreeze(props);

            expect(() => min(5, props)(5)).not.toThrow();
        });
    });
});
