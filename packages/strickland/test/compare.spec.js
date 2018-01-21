import deepFreeze from 'deep-freeze';
import compare from '../src/compare';

describe('compare', () => {
    describe('with a single props argument', () => {
        const validate = compare({compare: 5, message: 'Custom message'});
        const result = validate(5);

        it('uses the compare prop', () => {
            expect(result.compare).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = compare(5, {message: 'Custom message'});
        const result = validate(4);

        it('sets the compare prop', () => {
            expect(result.compare).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('validates', () => {
        const validate = compare(3);

        it('with the value equal to the compare, it is valid', () => {
            const result = validate(3);
            expect(result.isValid).toBe(true);
        });

        it('with the value less than the compare, it is invalid', () => {
            const result = validate(2);
            expect(result.isValid).toBe(false);
        });

        it('with the value greater than the compare, it is invalid', () => {
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

        it('comparing against 0', () => {
            const validateAgainst0 = compare(0);
            const result = validateAgainst0(1);

            expect(result).toMatchObject({
                isValid: false,
                compare: 0,
                value: 1
            });
        });

        it('with a value of 0', () => {
            const result = validate(0)

            expect(result).toMatchObject({
                isValid: false,
                compare: 3,
                value: 0
            });
        });
    });

    describe('with a function for the compare value', () => {
        it('does not call the function during validator construction', () => {
            const getCompareValue = jest.fn();
            getCompareValue.mockReturnValue(6);

            compare(getCompareValue);
            expect(getCompareValue).not.toHaveBeenCalled();
        });

        it('the function is called at the time of validation', () => {
            const getCompareValue = jest.fn();
            getCompareValue.mockReturnValue(6);

            const validate = compare(getCompareValue);
            validate(5);

            expect(getCompareValue).toHaveBeenCalledTimes(1);
        });

        it('the function is called every time validation occurs', () => {
            const getCompareValue = jest.fn();
            getCompareValue.mockReturnValue(6);

            const validate = compare(getCompareValue);
            validate(7);
            validate(7);

            expect(getCompareValue).toHaveBeenCalledTimes(2);
        });

        it('validates using the function result', () => {
            const getCompareValue = jest.fn();
            getCompareValue.mockReturnValue(6);

            const validate = compare(getCompareValue);
            const result = validate(6);

            expect(result).toMatchObject({
                isValid: true,
                compare: 6,
                value: 6
            });
        });

        it('validation context is passed to the function', () => {
            const getCompareValue = jest.fn();
            getCompareValue.mockReturnValue(6);

            const validate = compare(getCompareValue, {a: 'validator context'});
            validate(6, {b: 'validation context'});

            expect(getCompareValue.mock.calls[0][0]).toMatchObject({
                value: 6,
                compare: getCompareValue,
                a: 'validator context',
                b: 'validation context'
            });
        });
    });

    describe('with props passed into validation', () => {
        it('allows the compare value to be specified at time of validation, overriding a compare function', () => {
            let compareValue = 5;

            const validatorProps = {
                compare: () => compareValue
            };

            const validate = compare(validatorProps);
            const result = validate(6, {compare: 6});

            expect(result).toMatchObject({
                isValid: true,
                compare: 6
            });
        });
    });

    describe('does not mutate props', () => {
        it('when a single props argument is used', () => {
            const props = {compare: 5};
            deepFreeze(props);

            expect(() => compare(props)(5)).not.toThrow();
        });

        it('when a compare value and props are used', () => {
            const props = {message: 'Custom message'};
            deepFreeze(props);

            expect(() => compare(5, props)(5)).not.toThrow();
        });
    });
});
