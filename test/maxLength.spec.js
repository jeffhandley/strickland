import expect from 'expect';
import { maxLength } from '../src';

describe('maxLength', () => {
    describe('message', () => {
        it('defaults to "Length no more than ${max}"', () => {
            const validate = maxLength(2);
            const result = validate('ab');
            expect(result.message).toBe('Length no more than 2');
        });

        it('can be overridden through props', () => {
            const validate = maxLength(2, { message: 'Overridden' });
            const result = validate('ab');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = maxLength(2, { errorLevel: 10 });
            const result = validate('ab');
            expect(result.errorLevel).toBe(10);
        });
    });

    describe('treats falsy values as valid', () => {
        const validate = maxLength(1);
        let notDefined;

        [ notDefined, null, false, 0, '' ]
        .forEach((value) => {
            it(JSON.stringify(value), () => {
                const result = validate(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('treats falsy lengths as valid', () => {
        const validate = maxLength(1);
        let notDefined;

        [ notDefined, null, false, 0, '' ]
        .forEach((value) => {
            it(JSON.stringify(value), () => {
                const result = validate({ length: value });
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('validates length', () => {
        describe('for strings', () => {
            [
                { max: 2, value: 'a', isValid: true },
                { max: 2, value: 'ab', isValid: true },
                { max: 2, value: 'abc', isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = maxLength(test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for arrays', () => {
            [
                { max: 2, value: [ 'a' ], isValid: true },
                { max: 2, value: [ 'a', 'b' ], isValid: true },
                { max: 2, value: [ 'a', 'b', 'c' ], isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = maxLength(test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for objects', () => {
            [
                { max: 2, value: { length: 1 }, isValid: true },
                { max: 2, value: { length: 2 }, isValid: true },
                { max: 2, value: { length: 3 }, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = maxLength(test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });
});
