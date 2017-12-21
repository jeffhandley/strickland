import deepFreeze from 'deep-freeze';
import min from '../src/min';

describe('min', () => {
    describe('throws', () => {
        it('when min is non-numeric', () => {
            const validate = min('non-numeric');
            expect(() => validate()).toThrow();
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

    describe('with min as a function', () => {
        let getMinCalls = 0;

        const getMin = () => {
            return ++getMinCalls;
        };

        beforeEach(() => {
            getMinCalls = 0;
        });

        it('does not call the function during validator construction', () => {
            min(getMin);
            expect(getMinCalls).toBe(0);
        });

        it('the function is called at the time of validation', () => {
            const validate = min(getMin);
            validate(0);

            expect(getMinCalls).toBe(1);
        });

        it('validates using the function result', () => {
            getMinCalls = 5;

            const validate = min(getMin);
            const result = validate(7);

            expect(result).toMatchObject({
                isValid: true,
                min: 6,
                value: 7
            });
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
