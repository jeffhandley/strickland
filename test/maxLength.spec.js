import expect from 'expect';
import maxLength from '../src/maxLength';

describe('maxLength', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => maxLength()).toThrow();
        });

        it('when props is a string', () => {
            expect(() => maxLength('123')).toThrow();
        });

        it('when props is an object without a maxLength', () => {
            expect(() => maxLength({ min: 123 })).toThrow();
        });
    });

    describe('with a single props argument', () => {
        const validate = maxLength({maxLength: 3, message: 'Custom message'});
        const result = validate('123');

        it('uses the min prop', () => {
            expect(result.maxLength).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = maxLength(3, {message: 'Custom message'});
        const result = validate('123');

        it('sets the min prop', () => {
            expect(result.maxLength).toBe(3);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    it('returns the value on the result', () => {
        const validate = maxLength(5);
        const result = validate('1234');

        expect(result.value).toBe('1234');
    });

    describe('returns the parsedValue on the result', () => {
        const validate = maxLength(5);

        it('when the value is a string', () => {
            const result = validate('1234');
            expect(result.parsedValue).toBe('1234');
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

        it('when the value has leading spaces', () => {
            const result = validate('   1234');
            expect(result.parsedValue).toBe('1234');
        });

        it('when the value has trailing spaces', () => {
            const result = validate('1234   ');
            expect(result.parsedValue).toBe('1234');
        });

        it('when the value has leading and trailing spaces', () => {
            const result = validate('   1234   ');
            expect(result.parsedValue).toBe('1234');
        });
    });

    describe('returns the length on the result', () => {
        const validate = maxLength(5);

        it('when the value is a string', () => {
            const result = validate('1234');
            expect(result.length).toBe(4);
        });

        it('when the value is null', () => {
            const result = validate(null);
            expect(result.length).toBe(0);
        });

        it('when the value is an empty string', () => {
            const result = validate('');
            expect(result.length).toBe(0);
        });

        it('when the value is 0 as a string', () => {
            const result = validate('0');
            expect(result.length).toBe(1);
        });

        it('when the value has leading spaces', () => {
            const result = validate('   1234');
            expect(result.length).toBe(4);
        });

        it('when the value has trailing spaces', () => {
            const result = validate('1234   ');
            expect(result.length).toBe(4);
        });

        it('when the value has leading and trailing spaces', () => {
            const result = validate('   1234   ');
            expect(result.length).toBe(4);
        });
    });

    describe('validates', () => {
        const validate = maxLength(3);

        it('with the string length equal to the maxLength, it is valid', () => {
            const result = validate('123');
            expect(result.isValid).toBe(true);
        });

        it('with the string length less than the maxLength, it is valid', () => {
            const result = validate('12');
            expect(result.isValid).toBe(true);
        });

        it('with the string length greater than the maxLength, it is invalid', () => {
            const result = validate('1234');
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
});
