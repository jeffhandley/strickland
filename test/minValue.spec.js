import expect from 'expect';
import { minValue } from '../src';

describe('minValue', () => {
    describe('message', () => {
        it('defaults to "At least ${min}"', () => {
            const validate = minValue(2);
            const result = validate('ab');
            expect(result.message).toBe('At least 2');
        });

        it('can be overridden through props', () => {
            const validate = minValue(2, { message: 'Overridden' });
            const result = validate('ab');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = minValue(2, { errorLevel: 10 });
            const result = validate('ab');
            expect(result.errorLevel).toBe(10);
        });
    });

    describe('treats falsy values as valid', () => {
        const validate = minValue(1);
        let notDefined;

        [ notDefined, null, false, 0, '' ]
        .forEach((value) => {
            it(JSON.stringify(value), () => {
                const result = validate(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('validates values', () => {
        describe('for numbers', () => {
            [
                { min: 2, value: 1, isValid: false },
                { min: 2, value: 2, isValid: true },
                { min: 2, value: 3, isValid: true }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = minValue(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for strings', () => {
            [
                { min: 'b', value: 'a', isValid: false },
                { min: 'b', value: 'b', isValid: true },
                { min: 'b', value: 'c', isValid: true }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = minValue(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for dates', () => {
            [
                { min: new Date(2016, 4, 13), value: new Date(2016, 4, 12), isValid: false },
                { min: new Date(2016, 4, 13), value: new Date(2016, 4, 13), isValid: true },
                { min: new Date(2016, 4, 13), value: new Date(2016, 4, 14), isValid: true }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = minValue(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });
});
