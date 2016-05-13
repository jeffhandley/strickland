import expect from 'expect';
import minvalue from '../src/minvalue';

describe('minvalue', () => {
    describe('recognizes empty values as valid', () => {
        [
            { value: null, testName: 'null' },
            { value: 0, testName: 0 },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = minvalue(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values at least min as valid', () => {
        [
            { min: 1, value: 1 },
            { min: 2, value: 2 },
            { min: 2, value: 3 },
            { min: 'a', value: 'a' },
            { min: 'b', value: 'b' },
            { min: 'b', value: 'c' }
        ].forEach(({ min, value }) => {
            it(`min: ${min}; value: ${value}`, () => {
                const result = minvalue(value, min);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values less than min as invalid', () => {
        [
            { min: 2, value: 1 },
            { min: 3, value: 2 },
            { min: 'b', value: 'a' },
            { min: 'c', value: 'b' }
        ].forEach(({ min, value }) => {
            it(`min: ${min}; value: ${value}`, () => {
                const result = minvalue(value, min);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "At least ${min}"', () => {
            const result = minvalue('a', 4);
            expect(result.message).toBe('At least 4');
        });

        it('can be overridden through props as the 3rd argument', () => {
            const result = minvalue('a', 4, { message: 'Overridden' });
            expect(result.message).toBe('Overridden');
        });

        it('can be overridden through props as the 2nd argument', () => {
            const result = minvalue('a', { min: 4, message: 'Overridden' });
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const result = minvalue('a', { errorLevel: 10 });
            expect(result.errorLevel).toBe(10);
        });
    });
});
