import expect from 'expect';
import { length } from '../src';

describe('length', () => {
    describe('message', () => {
        it('defaults to "Length of ${min}" for an exact length', () => {
            const validate = length(2);
            const result = validate('ab');
            expect(result.message).toBe('Length of 2');
        });

        it('defaults to "Length between ${min} and ${max}" for a range', () => {
            const validate = length(2, 3);
            const result = validate('ab');
            expect(result.message).toBe('Length between 2 and 3');
        });

        it('can be overridden through props', () => {
            const validate = length(2, 3, { message: 'Overridden' });
            const result = validate('ab');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = length(2, 3, { errorLevel: 10 });
            const result = validate('ab');
            expect(result.errorLevel).toBe(10);
        });
    });

    describe('treats falsy values as valid', () => {
        const validate = length(1);
        let notDefined;

        [ notDefined, null, false, 0, '' ]
        .forEach((value) => {
            it(JSON.stringify(value), () => {
                const result = validate(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('uses only a min as an exact length', () => {
        describe('for strings', () => {
            [
                { min: 2, value: 'a', isValid: false },
                { min: 2, value: 'ab', isValid: true },
                { min: 2, value: 'abc', isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for arrays', () => {
            [
                { min: 2, value: [ 'a' ], isValid: false },
                { min: 2, value: [ 'a', 'b' ], isValid: true },
                { min: 2, value: [ 'a', 'b', 'c' ], isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for objects', () => {
            [
                { min: 2, value: { }, isValid: false },
                { min: 2, value: { length: 1 }, isValid: false },
                { min: 2, value: { length: 2 }, isValid: true },
                { min: 2, value: { length: 3 }, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });

    describe('uses a min/max pair as a length range', () => {
        describe('for strings', () => {
            [
                { min: 2, max: 3, value: 'a', isValid: false },
                { min: 2, max: 3, value: 'ab', isValid: true },
                { min: 2, max: 3, value: 'abc', isValid: true },
                { min: 2, max: 3, value: 'abcd', isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.min, test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for arrays', () => {
            [
                { min: 2, max: 3, value: [ 'a' ], isValid: false },
                { min: 2, max: 3, value: [ 'a', 'b' ], isValid: true },
                { min: 2, max: 3, value: [ 'a', 'b', 'c' ], isValid: true },
                { min: 2, max: 3, value: [ 'a', 'b', 'c', 'd' ], isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.min, test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for objects', () => {
            [
                { min: 2, max: 3, value: { }, isValid: false },
                { min: 2, max: 3, value: { length: 1 }, isValid: false },
                { min: 2, max: 3, value: { length: 2 }, isValid: true },
                { min: 2, max: 3, value: { length: 3 }, isValid: true },
                { min: 2, max: 3, value: { length: 4 }, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.min, test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });
});
