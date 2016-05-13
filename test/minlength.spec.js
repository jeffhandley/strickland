import expect from 'expect';
import minlength from '../src/minlength';

describe('minlength', () => {
    describe('recognizes empty values as valid', () => {
        [
            { value: null, testName: 'null' },
            { value: false, testName: false },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = minlength(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values at least as long as min as valid', () => {
        [
            { min: 1, value: 'a', testName: 'a' },
            { min: 2, value: 'ab', testName: 'ab' },
            { min: 2, value: 'abc', testName: 'abc' },
            { min: 1, value: [ 0 ], testName: '[0]' },
            { min: 2, value: [ 0, 1 ], testName: '[0, 1]' },
            { min: 2, value: [ 0, 1, 2 ], testName: '[0, 1, 2]' }
        ].forEach(({ min, value, testName }) => {
            it(`min: ${min}; value: ${testName}`, () => {
                const result = minlength(value, min);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values shorter than min as invalid', () => {
        [
            { min: 2, value: 'a', testName: 'a' },
            { min: 3, value: 'ab', testName: 'ab' },
            { min: 2, value: [ 0 ], testName: '[0]' },
            { min: 3, value: [ 0, 1 ], testName: '[0, 1]' }
        ].forEach(({ min, value, testName }) => {
            it(`min: ${min}; value: ${testName}`, () => {
                const result = minlength(value, min);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "At least ${min} characters"', () => {
            const result = minlength('a', 4);
            expect(result.message).toBe('At least 4 characters');
        });

        it('can be overridden through props as the 3rd argument', () => {
            const result = minlength('a', 4, { message: 'Overridden' });
            expect(result.message).toBe('Overridden');
        });

        it('can be overridden through props as the 2nd argument', () => {
            const result = minlength('a', { min: 4, message: 'Overridden' });
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const result = minlength('a', { errorLevel: 10 });
            expect(result.errorLevel).toBe(10);
        });
    });
});
