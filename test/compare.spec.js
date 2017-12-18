import expect from 'expect';
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
        function parseValue(value) {
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

    describe('does not trim', () => {
        const validate = compare('  123  ');
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
});
