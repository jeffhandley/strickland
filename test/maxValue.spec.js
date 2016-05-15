import expect from 'expect';
import { maxValue } from '../src';

describe('maxValue', () => {
    describe('message', () => {
        it('defaults to "No more than ${max}"', () => {
            const validate = maxValue(2);
            const result = validate(2);
            expect(result.message).toBe('No more than 2');
        });

        it('can be overridden through props', () => {
            const validate = maxValue(2, { message: 'Overridden' });
            const result = validate(2);
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = maxValue(2, { errorLevel: 10 });
            const result = validate(2);
            expect(result.errorLevel).toBe(10);
        });

        it('guards against null', () => {
            const validate = maxValue(2, null);
            const result = validate(2);
            expect(result.message).toExist();
        });
    });

    describe('treats falsy values as valid', () => {
        const validate = maxValue(1);
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
                { max: 2, value: 1, isValid: true },
                { max: 2, value: 2, isValid: true },
                { max: 2, value: 3, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = maxValue(test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for strings', () => {
            [
                { max: 'b', value: 'a', isValid: true },
                { max: 'b', value: 'b', isValid: true },
                { max: 'b', value: 'c', isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = maxValue(test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for dates', () => {
            [
                { max: new Date(2016, 4, 13), value: new Date(2016, 4, 12), isValid: true },
                { max: new Date(2016, 4, 13), value: new Date(2016, 4, 13), isValid: true },
                { max: new Date(2016, 4, 13), value: new Date(2016, 4, 14), isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = maxValue(test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });
});
