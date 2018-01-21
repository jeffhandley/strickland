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
        it('does not call the function during validator construction', () => {
            const getMin = jest.fn();
            getMin.mockReturnValue(6);

            min(getMin);
            expect(getMin).not.toHaveBeenCalled();
        });

        it('the function is called at the time of validation', () => {
            const getMin = jest.fn();
            getMin.mockReturnValue(6);

            const validate = min(getMin);
            validate(0);

            expect(getMin).toHaveBeenCalledTimes(1);
        });

        it('the function is called every time validation occurs', () => {
            const getMin = jest.fn();
            getMin.mockReturnValue(6);

            const validate = min(getMin);
            validate(0);
            validate(0);

            expect(getMin).toHaveBeenCalledTimes(2);
        });

        it('validates using the function result', () => {
            const getMin = jest.fn();
            getMin.mockReturnValue(6);

            const validate = min(getMin);
            const result = validate(7);

            expect(result).toMatchObject({
                isValid: true,
                min: 6,
                value: 7
            });
        });

        it('validation context is passed to the function', () => {
            const getMin = jest.fn();
            getMin.mockReturnValue(6);

            const validate = min(getMin, {a: 'validator context'});
            validate(5, {b: 'validation context'});

            expect(getMin.mock.calls[0][0]).toMatchObject({
                value: 5,
                min: getMin,
                a: 'validator context',
                b: 'validation context'
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

        it('with a string value, it is not valid', () => {
            const result = validate('A');
            expect(result.isValid).toBe(false);
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
