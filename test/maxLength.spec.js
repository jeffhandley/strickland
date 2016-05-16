import expect from 'expect';
import deepFreeze from 'deep-freeze';
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

        it('guards against null', () => {
            const validate = maxLength(2, null);
            const result = validate('ab');
            expect(result.message).toExist();
        });

        describe('do not get mutated', () => {
            const props = { errorLevel: 10 };
            deepFreeze(props);

            it('during creation', () => {
                maxLength(2, props);
            });

            it('during validation', () => {
                const validate = maxLength(2, props);
                validate('ab');
            });
        });
    });

    describe('ignores values', () => {
        describe('ignoring falsy values by default', () => {
            const validate = maxLength(1);
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
                    const validate = maxLength(1, { isIgnored: test.isIgnored });
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
