import expect from 'expect';
import { minvalue } from '../src';

describe('minvalue', () => {
    describe('recognizes empty values as valid', () => {
        const validate = minvalue(1);

        [
            { value: null, testName: 'null' },
            { value: 0, testName: 0 },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = validate(value);
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
                const validate = minvalue(min);
                const result = validate(value);
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
                const validate = minvalue(min);
                const result = validate(value);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "At least ${min}"', () => {
            const validate = minvalue(4);
            const result = validate('a');
            expect(result.message).toBe('At least 4');
        });

        it('can be overridden through props', () => {
            const validate = minvalue(4, { message: 'Overridden' });
            const result = validate('a');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = minvalue('a', { errorLevel: 10 });
            const result = validate('a');
            expect(result.errorLevel).toBe(10);
        });
    });
});
