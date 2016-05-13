import expect from 'expect';
import required from '../src/required';

describe('required', () => {
    describe('recognizes truthy values as valid', () => {
        [
            { value: true, testName: 'true' },
            { value: 1, testName: '1' },
            { value: 'non-empty string', testName: 'non-empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = required(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes falsey values as invalid', () => {
        [
            { value: false, testName: 'false' },
            { value: 0, testName: '0' },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = required(value);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "Required"', () => {
            const result = required(true);
            expect(result.message).toBe('Required');
        });

        it('can be overridden through props', () => {
            const result = required(true, { message: 'Overridden' });
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const result = required(true, { errorLevel: 10 });
            expect(result.errorLevel).toBe(10);
        });
    });
});
