import expect from 'expect';
import deepFreeze from 'deep-freeze';
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

        describe('do not get mutated', () => {
            const props = { errorLevel: 10 };
            deepFreeze(props);

            it('during creation', () => {
                maxValue(2, 3, props);
            });

            it('during validation', () => {
                const validate = maxValue(2, 3, props);
                validate(2);
            });
        });

        describe('get populated with validator properties', () => {
            const validate = maxValue(2);
            const result = validate(2);

            it('max', () => {
                expect(result.max).toBe(2);
            });
        });
    });

    describe('ignores values', () => {
        describe('ignoring falsy values by default', () => {
            const validate = maxValue(1);
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
                { isIgnored: (val) => (val === 4), name: 'as a function returning true' }
            ]
            .forEach((test) => {
                describe(test.name, () => {
                    const validate = maxValue(2, { isIgnored: test.isIgnored });
                    const result = validate(4);

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
