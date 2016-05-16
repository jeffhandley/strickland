import expect from 'expect';
import deepFreeze from 'deep-freeze';
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

        describe('do not get mutated', () => {
            const props = { errorLevel: 10 };
            deepFreeze(props);

            it('during creation', () => {
                maxFieldValue('field', 2, props);
            });

            it('during validation', () => {
                const validate = maxFieldValue('field', 2, props);
                validate(2);
            });
        });
    });

    describe('ignores values', () => {
        describe('ignoring falsy values by default', () => {
            const validate = maxFieldValue('field', 1);
            let notDefined;

            [ notDefined, null, false, 0, '' ]
            .forEach((test) => {
                describe(JSON.stringify(test), () => {
                    const result = validate(test);

                    it('setting isValid to true', () => {
                        expect(result.isValid).toBe(true);
                    });

                    it('setting isIgnored to true', () => {
                        expect(result.isIgnored).toBe(true);
                    });
                });
            });
        });

        describe('using a custom isIgnored prop', () => {
            [
                { isIgnored: true, name: 'as true' },
                { isIgnored: (value) => (value.field === 4), name: 'as a function returning true' }
            ]
            .forEach((test) => {
                describe(test.name, () => {
                    const validate = maxFieldValue('field', 1, { isIgnored: test.isIgnored });
                    const result = validate({ field: 4 });

                    it('setting isValid to true', () => {
                        expect(result.isValid).toBe(true);
                    });

                    it('setting isIgnored to true', () => {
                        expect(result.isIgnored).toBe(true);
                    });
                });
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
