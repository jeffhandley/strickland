import expect from 'expect';
import { maxFieldValue } from '../src';

describe('maxFieldValue', () => {
    describe('message', () => {
        it('defaults to "${field} no more than ${max}"', () => {
            const validate = maxFieldValue('number', 2);
            const result = validate({ number: 2 });
            expect(result.message).toBe('number no more than 2');
        });

        it('can be overridden through props', () => {
            const validate = maxFieldValue('number', 2, { message: 'Overridden' });
            const result = validate({ number: 2 });
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = maxFieldValue('number', 2, { errorLevel: 10 });
            const result = validate({ number: 2 });
            expect(result.errorLevel).toBe(10);
        });

        it('guards against null', () => {
            const validate = maxFieldValue('field', 2, null);
            const result = validate({ field: 2 });
            expect(result.message).toExist();
        });
    });

    describe('treats falsy values as valid', () => {
        const validate = maxFieldValue('field', 1);
        let notDefined;

        [ notDefined, null, false, 0, '' ]
        .forEach((value) => {
            it(JSON.stringify(value), () => {
                const result = validate(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('treats falsy fields as valid', () => {
        const validate = maxFieldValue('field', 1);
        let notDefined;

        [ notDefined, null, false, 0, '' ]
        .forEach((value) => {
            it(JSON.stringify(value), () => {
                const result = validate({ field: value });
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('validates field values', () => {
        describe('for numbers', () => {
            [
                { max: 2, value: 1, isValid: true },
                { max: 2, value: 2, isValid: true },
                { max: 2, value: 3, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = maxFieldValue('number', test.max);
                    const result = validate({ number: test.value });
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
                    const validate = maxFieldValue('string', test.max);
                    const result = validate({ string: test.value });
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
                    const validate = maxFieldValue('date', test.max);
                    const result = validate({ date: test.value });
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });
});
