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
    });

    describe('with a function for the compare value', () => {
        let getValueCalls = 0;

        function getValue() {
            getValueCalls++;
            return 'value to compare';
        }

        const validate = compare(getValue);
        const result = validate('value to compare');

        it('calls the function (once) to get the compare value', () => {
            expect(getValueCalls).toBe(1);
        });

        it('sets the compare value to the result of the function', () => {
            expect(result.compare).toBe('value to compare');
        });

        it('the function is called each time validation occurs', () => {
            let calls = 0;

            function getValueOnValidation() {
                return ++calls;
            }

            const validateMultipleTimes = compare(getValueOnValidation);

            validateMultipleTimes(1);
            validateMultipleTimes(2);

            expect(calls).toBe(2);
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
