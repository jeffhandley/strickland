import deepFreeze from 'deep-freeze';
import max from '../src/max';

describe('max', () => {
    describe('throws', () => {
        it('when max is non-numeric', () => {
            const validate = max('non-numeric');
            expect(() => validate()).toThrow();
        });
    });

    describe('with a single props argument', () => {
        const validate = max({max: 5, message: 'Custom message'});
        const result = validate(4);

        it('uses the max prop', () => {
            expect(result.max).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = max(5, {message: 'Custom message'});
        const result = validate(4);

        it('sets the max prop', () => {
            expect(result.max).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with max provided at the time of validation', () => {
        const validate = max();
        const result = validate(4, {max: 5, message: 'Custom message'});

        it('sets the max prop', () => {
            expect(result.max).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with max as a function', () => {
        let getMaxCalls = 0;

        const getMax = () => {
            return ++getMaxCalls;
        };

        beforeEach(() => {
            getMaxCalls = 0;
        });

        it('does not call the function during validator construction', () => {
            max(getMax);
            expect(getMaxCalls).toBe(0);
        });

        it('the function is called at the time of validation', () => {
            const validate = max(getMax);
            validate(0);

            expect(getMaxCalls).toBe(1);
        });

        it('validates using the function result', () => {
            getMaxCalls = 5;

            const validate = max(getMax);
            const result = validate(4);

            expect(result).toMatchObject({
                isValid: true,
                max: 6,
                value: 4
            });
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

        it('with a string value, it is not valid', () => {
            const result = validate('A');
            expect(result.isValid).toBe(false);
        });
    });

    describe('with props passed into validation', () => {
        it('allows the max value to be specified at time of validation', () => {
            const validatorProps = {max: 5};
            const validate = max(validatorProps);
            const result = validate(6, {max: 6});

            expect(result).toMatchObject({
                isValid: true,
                max: 6
            });
        });
    });

    describe('does not mutate props', () => {
        it('when a single props argument is used', () => {
            const props = {max: 5};
            deepFreeze(props);

            expect(() => max(props)(5)).not.toThrow();
        });

        it('when a max value and props are used', () => {
            const props = {message: 'Custom message'};
            deepFreeze(props);

            expect(() => max(5, props)(5)).not.toThrow();
        });
    });
});
