import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { length } from '../src';

describe('length', () => {
    describe('message', () => {
        it('defaults to "Length of ${exactly}" for an exact length', () => {
            const validate = length(2);
            const result = validate('ab');
            expect(result.message).toBe('Length of 2');
        });

        it('defaults to "Length between ${min} and ${max}" for a range', () => {
            const validate = length(2, 3);
            const result = validate('ab');
            expect(result.message).toBe('Length between 2 and 3');
        });

        it('can be overridden through props', () => {
            const validate = length(2, 3, { message: 'Overridden' });
            const result = validate('ab');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = length(2, 3, { errorLevel: 10 });
            const result = validate('ab');
            expect(result.errorLevel).toBe(10);
        });

        it('guards against null', () => {
            const validate = length(2, 3, null);
            const result = validate('ab');
            expect(result.message).toExist();
        });

        describe('do not get mutated', () => {
            const props = { errorLevel: 10 };
            deepFreeze(props);

            it('during creation', () => {
                length(2, 3, props);
            });

            it('during validation', () => {
                const validate = length(2, 3, props);
                validate('ab');
            });
        });

        describe('get populated with validator properties', () => {
            const validate = length(2, 3);
            const result = validate('ab');

            it('validator', () => {
                expect(result.validator).toBe(length);
            });

            it('min', () => {
                expect(result.min).toBe(2);
            });

            it('max', () => {
                expect(result.max).toBe(3);
            });
        });
    });

    describe('ignores values', () => {
        describe('ignoring falsy values by default', () => {
            const validate = length(1);
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
                    const validate = length(1, 2, { isIgnored: test.isIgnored });
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

    describe('uses a single argument as an exact length', () => {
        describe('for strings', () => {
            [
                { exactly: 2, value: '', isValid: true },
                { exactly: 2, value: 'a', isValid: false },
                { exactly: 2, value: 'ab', isValid: true },
                { exactly: 2, value: 'abc', isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.exactly);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for arrays', () => {
            [
                { exactly: 2, value: [ ], isValid: true },
                { exactly: 2, value: [ 'a' ], isValid: false },
                { exactly: 2, value: [ 'a', 'b' ], isValid: true },
                { exactly: 2, value: [ 'a', 'b', 'c' ], isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.exactly);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for objects', () => {
            [
                { exactly: 2, value: { length: 0 }, isValid: false },
                { exactly: 2, value: { length: 1 }, isValid: false },
                { exactly: 2, value: { length: 2 }, isValid: true },
                { exactly: 2, value: { length: 3 }, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.exactly);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });

    describe('uses a min/max pair as a length range', () => {
        describe('for strings', () => {
            [
                { min: 2, max: 3, value: '', isValid: true },
                { min: 2, max: 3, value: 'a', isValid: false },
                { min: 2, max: 3, value: 'ab', isValid: true },
                { min: 2, max: 3, value: 'abc', isValid: true },
                { min: 2, max: 3, value: 'abcd', isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.min, test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for arrays', () => {
            [
                { min: 2, max: 3, value: [ ], isValid: true },
                { min: 2, max: 3, value: [ 'a' ], isValid: false },
                { min: 2, max: 3, value: [ 'a', 'b' ], isValid: true },
                { min: 2, max: 3, value: [ 'a', 'b', 'c' ], isValid: true },
                { min: 2, max: 3, value: [ 'a', 'b', 'c', 'd' ], isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.min, test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });

        describe('for objects', () => {
            [
                { min: 2, max: 3, value: { length: 0 }, isValid: false },
                { min: 2, max: 3, value: { length: 1 }, isValid: false },
                { min: 2, max: 3, value: { length: 2 }, isValid: true },
                { min: 2, max: 3, value: { length: 3 }, isValid: true },
                { min: 2, max: 3, value: { length: 4 }, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const validate = length(test.min, test.max);
                    const result = validate(test.value);
                    expect(result.isValid).toBe(test.isValid);
                });
            });
        });
    });
});
