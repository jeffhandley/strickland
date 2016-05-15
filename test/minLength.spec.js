import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { minLength } from '../src';

describe('minLength', () => {
    describe('message', () => {
        it('defaults to "Length of at least ${min}"', () => {
            const validate = minLength(2);
            const result = validate('ab');
            expect(result.message).toBe('Length of at least 2');
        });

        it('can be overridden through props', () => {
            const validate = minLength(2, { message: 'Overridden' });
            const result = validate('ab');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = minLength(2, { errorLevel: 10 });
            const result = validate('ab');
            expect(result.errorLevel).toBe(10);
        });

        it('guards against null', () => {
            const validate = minLength(2, null);
            const result = validate('ab');
            expect(result.message).toExist();
        });

        describe('do not get mutated', () => {
            const props = { errorLevel: 10 };
            deepFreeze(props);

            it('during creation', () => {
                minLength(2, props);
            });

            it('during validation', () => {
                const validate = minLength(2, props);
                validate('ab');
            });
        });
    });

    describe('treats falsy values as valid', () => {
        const validate = minLength(1);
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
        const validate = minLength(1);
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

    describe('validates length', () => {
        describe('for strings', () => {
            [
                { min: 2, value: 'a', isValid: false },
                { min: 2, value: 'ab', isValid: true },
                { min: 2, value: 'abc', isValid: true }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = minLength(test.min);
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
                    const validate = minLength(test.min);
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
                    const validate = minLength(test.min);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });
});
