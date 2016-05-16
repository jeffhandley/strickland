import expect from 'expect';
import { validation, required, length, minLength, maxLength } from '../src';

describe('scenarios', () => {
    describe('for required values', () => {
        describe('with an exact length', () => {
            const validators = [
                required(),
                length(2)
            ];

            describe('string', () => {
                [
                    { value: null, isValid: false },
                    { value: '', isValid: false },
                    { value: 'a', isValid: false },
                    { value: 'ab', isValid: true },
                    { value: 'abc', isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('array', () => {
                [
                    { value: null, isValid: false },
                    { value: [ ], isValid: false },
                    { value: [ 1 ], isValid: false },
                    { value: [ 1, 2 ], isValid: true },
                    { value: [ 1, 2, 3 ], isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('object', () => {
                [
                    { value: null, isValid: false },
                    { value: { }, isValid: false },
                    { value: { length: 1 }, isValid: false },
                    { value: { length: 2 }, isValid: true },
                    { value: { length: 3 }, isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });
        });

        describe('with a length range', () => {
            const validators = [
                required(),
                length(2, 3)
            ];

            describe('string', () => {
                [
                    { value: null, isValid: false },
                    { value: '', isValid: false },
                    { value: 'a', isValid: false },
                    { value: 'ab', isValid: true },
                    { value: 'abc', isValid: true },
                    { value: 'abcd', isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('array', () => {
                [
                    { value: null, isValid: false },
                    { value: [ ], isValid: false },
                    { value: [ 1 ], isValid: false },
                    { value: [ 1, 2 ], isValid: true },
                    { value: [ 1, 2, 3 ], isValid: true },
                    { value: [ 1, 2, 3, 4 ], isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('object', () => {
                [
                    { value: null, isValid: false },
                    { value: { }, isValid: false },
                    { value: { length: 1 }, isValid: false },
                    { value: { length: 2 }, isValid: true },
                    { value: { length: 3 }, isValid: true },
                    { value: { length: 4 }, isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });
        });

        describe('with a min length', () => {
            const validators = [
                required(),
                minLength(2)
            ];

            describe('string', () => {
                [
                    { value: null, isValid: false },
                    { value: '', isValid: false },
                    { value: 'a', isValid: false },
                    { value: 'ab', isValid: true },
                    { value: 'abc', isValid: true }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('array', () => {
                [
                    { value: null, isValid: false },
                    { value: [ ], isValid: false },
                    { value: [ 1 ], isValid: false },
                    { value: [ 1, 2 ], isValid: true },
                    { value: [ 1, 2, 3 ], isValid: true }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('object', () => {
                [
                    { value: null, isValid: false },
                    { value: { }, isValid: false },
                    { value: { length: 1 }, isValid: false },
                    { value: { length: 2 }, isValid: true },
                    { value: { length: 3 }, isValid: true }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });
        });

        describe('with a max length', () => {
            const validators = [
                required(),
                maxLength(2)
            ];

            describe('string', () => {
                [
                    { value: null, isValid: false },
                    { value: '', isValid: false },
                    { value: 'a', isValid: true },
                    { value: 'ab', isValid: true },
                    { value: 'abc', isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('array', () => {
                [
                    { value: null, isValid: false },
                    { value: [ ], isValid: false },
                    { value: [ 1 ], isValid: true },
                    { value: [ 1, 2 ], isValid: true },
                    { value: [ 1, 2, 3 ], isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('object', () => {
                [
                    { value: null, isValid: false },
                    { value: { }, isValid: false },
                    { value: { length: 1 }, isValid: true },
                    { value: { length: 2 }, isValid: true },
                    { value: { length: 3 }, isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });
        });
    });
});
