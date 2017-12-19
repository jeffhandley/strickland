import expect from 'expect';
import deepFreeze from 'deep-freeze';
import compare from '../src/compare';

describe('compare', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => compare()).toThrow();
        });

        it('when props is an object without a compare', () => {
            expect(() => compare({message: 'Custom message'})).toThrow();
        });
    });

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

    it('returns the value on the result', () => {
        const validate = compare(5);
        const result = validate(5);

        expect(result.value).toBe(5);
    });

    describe('returns the parsedValue on the result', () => {
        const validate = compare(5);

        it('when the value is a number', () => {
            const result = validate(5);
            expect(result.parsedValue).toBe('5');
        });

        it('when the value is a string', () => {
            const result = validate('5');
            expect(result.parsedValue).toBe('5');
        });

        it('when the value is null', () => {
            const result = validate(null);
            expect(result.parsedValue).toBe('');
        });

        it('when the value is an empty string', () => {
            const result = validate('');
            expect(result.parsedValue).toBe('');
        });

        it('when the value is 0 as a string', () => {
            const result = validate('0');
            expect(result.parsedValue).toBe('0');
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

        it('with a string value equal to the numeric compare, it is valid', () => {
            const result = validate('3');
            expect(result.isValid).toBe(true);
        });

        it('with a string value less than the numeric compare, it is invalid', () => {
            const result = validate('2');
            expect(result.isValid).toBe(false);
        });

        it('with a string value greater than the numeric compare, it is invalid', () => {
            const result = validate('4');
            expect(result.isValid).toBe(false);
        });
    });

    describe('with a custom parseValue function', () => {
        function parseValue() {
            return 34;
        }

        const validate = compare(5, {parseValue});
        const result = validate('3');

        it('parses the value', () => {
            expect(result.parsedValue).toBe(34);
        });

        it('parses the compare value', () => {
            expect(result.parsedCompare).toBe(34);
        });

        it('the parsedValue and parsedCompare are compared', () => {
            expect(result.isValid).toBe(true);
        });
    });

    describe('trims by default', () => {
        const validate = compare('  123  ');
        const result = validate(' 123 ');

        it('the value', () => {
            expect(result.parsedValue).toBe('123');
        });

        it('the compare value', () => {
            expect(result.parsedCompare).toBe('123');
        });

        it('and allows whitespace differences to be valid', () => {
            expect(result.isValid).toBe(true);
        });
    });

    describe('if specified on props, will not trim', () => {
        const validate = compare('  123  ', {trim: false});
        const result = validate(' 123 ');

        it('the value', () => {
            expect(result.parsedValue).toBe(' 123 ');
        });

        it('the compare value', () => {
            expect(result.parsedCompare).toBe('  123  ');
        });

        it('and causes whitespace differences to be invalid', () => {
            expect(result.isValid).toBe(false);
        });
    });

    describe('with a function for the compare value', () => {
        let getValueCalls = 0;

        function getValue() {
            getValueCalls++;
            return '  value to compare  ';
        }

        const validate = compare(getValue);
        const result = validate(' value to compare ');

        it('calls the function (once) to get the compare value', () => {
            expect(getValueCalls).toBe(1);
        });

        it('sets the compare value to the result of the function', () => {
            expect(result.compare).toBe('  value to compare  ');
        });

        it('parses the compare value from the function', () => {
            expect(result.parsedCompare).toBe('value to compare');
        });

        it('validates against the parsed compare value', () => {
            expect(result.isValid).toBe(true);
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
