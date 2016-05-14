import expect from 'expect';
import exactlength from '../src/exactlength';

describe('exactlength', () => {
    describe('recognizes empty values as valid', () => {
        const validate = exactlength(1);

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

    describe('recognizes values with the exact length as valid', () => {
        [
            { length: 1, value: 'a', testName: 'a' },
            { length: 2, value: 'ab', testName: 'ab' },
            { length: 1, value: [ 0 ], testName: '[0]' },
            { length: 2, value: [ 0, 1 ], testName: '[0, 1]' }
        ].forEach(({ length, value, testName }) => {
            it(`length: ${length}; value: ${testName}`, () => {
                const validate = exactlength(length);
                const result = validate(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values shorter than length as invalid', () => {
        [
            { length: 2, value: 'a', testName: 'a' },
            { length: 3, value: 'ab', testName: 'ab' },
            { length: 2, value: [ 0 ], testName: '[0]' },
            { length: 3, value: [ 0, 1 ], testName: '[0, 1]' }
        ].forEach(({ length, value, testName }) => {
            it(`length: ${length}; value: ${testName}`, () => {
                const validate = exactlength(length);
                const result = validate(value);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('recognizes values longer than length as invalid', () => {
        [
            { length: 2, value: 'abc', testName: 'abc' },
            { length: 3, value: 'abcd', testName: 'abcd' },
            { length: 2, value: [ 0, 1, 2 ], testName: '[0, 1, 2]' },
            { length: 3, value: [ 0, 1, 2, 3 ], testName: '[0, 1, 2, 3]' }
        ].forEach(({ length, value, testName }) => {
            it(`length: ${length}; value: ${testName}`, () => {
                const validate = exactlength(length);
                const result = validate(value);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "Exactly ${length} characters"', () => {
            const validate = exactlength(4);
            const result = validate('a');
            expect(result.message).toBe('Exactly 4 characters');
        });

        it('can be overridden through props', () => {
            const validate = exactlength(4, { message: 'Overridden' });
            const result = validate('a');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = exactlength(4, { errorLevel: 10 });
            const result = validate('a');
            expect(result.errorLevel).toBe(10);
        });
    });
});
