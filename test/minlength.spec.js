import expect from 'expect';
import minlength from '../src/minlength';

describe('minlength', () => {
    describe('recognizes empty values as valid', () => {
        const validate = minlength(1);

        [
            { value: null, testName: 'null' },
            { value: false, testName: false },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = validate(value);
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
                const validate = minlength(min);
                const result = validate(value);
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
                const validate = minlength(min);
                const result = validate(value);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "At least ${min} characters"', () => {
            const validate = minlength(4);
            const result = validate('a');
            expect(result.message).toBe('At least 4 characters');
        });

        it('can be overridden through props', () => {
            const validate = minlength(4, { message: 'Overridden' });
            const result = validate('a');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = minlength(4, { errorLevel: 10 });
            const result = validate('a');
            expect(result.errorLevel).toBe(10);
        });
    });
});
