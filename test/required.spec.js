import expect from 'expect';
import { required } from '../src';

describe('required', () => {
    describe('recognizes truthy values as valid', () => {
        const validate = required();

        [
            { value: true, testName: 'true' },
            { value: 1, testName: '1' },
            { value: 'non-empty string', testName: 'non-empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = validate(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes falsey values as invalid', () => {
        const validate = required();

        [
            { value: false, testName: 'false' },
            { value: 0, testName: '0' },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = validate(value);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "Required"', () => {
            const validate = required();
            const result = validate(true);
            expect(result.message).toBe('Required');
        });

        it('can be overridden through props', () => {
            const validate = required({ message: 'Overridden' });
            const result = validate(true);
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = required({ errorLevel: 10 });
            const result = validate(true);
            expect(result.errorLevel).toBe(10);
        });
    });
});
