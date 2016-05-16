import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { value } from '../src';

describe('value', () => {
    describe('message', () => {
        it('defaults to "Exactly ${exactly}" for an exact value', () => {
            const validate = value(2);
            const result = validate(2);
            expect(result.message).toBe('Exactly 2');
        });

        it('defaults to "Between ${min} and ${max}" for a range', () => {
            const validate = value(2, 3);
            const result = validate(2);
            expect(result.message).toBe('Between 2 and 3');
        });

        it('can be overridden through props', () => {
            const validate = value(2, 3, { message: 'Overridden' });
            const result = validate(2);
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = value(2, 3, { errorLevel: 10 });
            const result = validate(2);
            expect(result.errorLevel).toBe(10);
        });

        it('guards against null', () => {
            const validate = value(2, 3, null);
            const result = validate(2);
            expect(result.message).toExist();
        });

        describe('do not get mutated', () => {
            const props = { errorLevel: 10 };
            deepFreeze(props);

            it('during creation', () => {
                value(2, 3, props);
            });

            it('during validation', () => {
                const validate = value(2, 3, props);
                validate(2);
            });
        });
    });

    describe('ignores values', () => {
        describe('ignoring falsy values by default', () => {
            const validate = value(1);
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
                    const validate = value(1, 2, { isIgnored: test.isIgnored });
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

    describe('uses a min/max pair as a value range', () => {
        describe('for numbers', () => {
            [
                { min: 2, max: 3, value: 1, isValid: false },
                { min: 2, max: 3, value: 2, isValid: true },
                { min: 2, max: 3, value: 3, isValid: true },
                { min: 2, max: 3, value: 4, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = value(test.min, test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for strings', () => {
            [
                { min: 'b', max: 'c', value: 'a', isValid: false },
                { min: 'b', max: 'c', value: 'b', isValid: true },
                { min: 'b', max: 'c', value: 'c', isValid: true },
                { min: 'b', max: 'c', value: 'd', isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = value(test.min, test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for dates', () => {
            [
                { min: new Date(2016, 4, 13), max: new Date(2016, 4, 14), value: new Date(2016, 4, 12), isValid: false },
                { min: new Date(2016, 4, 13), max: new Date(2016, 4, 14), value: new Date(2016, 4, 13), isValid: true },
                { min: new Date(2016, 4, 13), max: new Date(2016, 4, 14), value: new Date(2016, 4, 14), isValid: true },
                { min: new Date(2016, 4, 13), max: new Date(2016, 4, 14), value: new Date(2016, 4, 15), isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = value(test.min, test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });
});
