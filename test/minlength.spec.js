import expect from 'expect';
import { minlength } from '../src';

describe('minlength', () => {
    describe('message', () => {
        it('defaults to "Length no less than ${min}"', () => {
            const validate = minlength(2);
            const result = validate('ab');
            expect(result.message).toBe('Length no less than 2');
        });

        it('can be overridden through props', () => {
            const validate = minlength(2, { message: 'Overridden' });
            const result = validate('ab');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = minlength(2, { errorLevel: 10 });
            const result = validate('ab');
            expect(result.errorLevel).toBe(10);
        });
    });

    describe('treats falsy values as valid', () => {
        const validate = minlength(1);
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
        const validate = minlength(1);
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
                { min: 2, value: 'a', isValid: false },
                { min: 2, value: 'ab', isValid: true },
                { min: 2, value: 'abc', isValid: true }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = minlength(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for arrays', () => {
            [
                { min: 2, value: [ 'a' ], isValid: false },
                { min: 2, value: [ 'a', 'b' ], isValid: true },
                { min: 2, value: [ 'a', 'b', 'c' ], isValid: true }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = minlength(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for objects', () => {
            [
                { min: 2, value: { length: 1 }, isValid: false },
                { min: 2, value: { length: 2 }, isValid: true },
                { min: 2, value: { length: 3 }, isValid: true }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = minlength(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });
});
