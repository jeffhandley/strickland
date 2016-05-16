import expect from 'expect';
import { validation, required, length, minLength, maxLength, value, minValue, maxValue, fieldValue, minFieldValue, maxFieldValue } from '../src';

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

        describe('with an exact value', () => {
            describe('number', () => {
                const validators = [
                    required(),
                    value(2)
                ];

                [
                    { value: null, isValid: false },
                    { value: 0, isValid: false },
                    { value: 1, isValid: false },
                    { value: 2, isValid: true },
                    { value: 3, isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('string', () => {
                const validators = [
                    required(),
                    value('b')
                ];

                [
                    { value: null, isValid: false },
                    { value: '', isValid: false },
                    { value: 'a', isValid: false },
                    { value: 'b', isValid: true },
                    { value: 'c', isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('date', () => {
                const validators = [
                    required(),
                    value(new Date(2016, 4, 13))
                ];

                [
                    { value: null, isValid: false },
                    { value: new Date(0), isValid: false },
                    { value: new Date(2016, 4, 12), isValid: false },
                    { value: new Date(2016, 4, 13), isValid: true },
                    { value: new Date(2016, 4, 14), isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });
        });

        describe('with a value range', () => {
            describe('number', () => {
                const validators = [
                    required(),
                    value(2, 3)
                ];

                [
                    { value: null, isValid: false },
                    { value: 0, isValid: false },
                    { value: 1, isValid: false },
                    { value: 2, isValid: true },
                    { value: 3, isValid: true },
                    { value: 4, isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('string', () => {
                const validators = [
                    required(),
                    value('b', 'c')
                ];

                [
                    { value: null, isValid: false },
                    { value: '', isValid: false },
                    { value: 'a', isValid: false },
                    { value: 'b', isValid: true },
                    { value: 'c', isValid: true },
                    { value: 'd', isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('date', () => {
                const validators = [
                    required(),
                    value(new Date(2016, 4, 13), new Date(2016, 4, 14))
                ];

                [
                    { value: null, isValid: false },
                    { value: new Date(0), isValid: false },
                    { value: new Date(2016, 4, 12), isValid: false },
                    { value: new Date(2016, 4, 13), isValid: true },
                    { value: new Date(2016, 4, 14), isValid: true },
                    { value: new Date(2016, 4, 15), isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });
        });

        describe('with a min value', () => {
            describe('number', () => {
                const validators = [
                    required(),
                    minValue(2)
                ];

                [
                    { value: null, isValid: false },
                    { value: 0, isValid: false },
                    { value: 1, isValid: false },
                    { value: 2, isValid: true },
                    { value: 3, isValid: true }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('string', () => {
                const validators = [
                    required(),
                    minValue('b')
                ];

                [
                    { value: null, isValid: false },
                    { value: '', isValid: false },
                    { value: 'a', isValid: false },
                    { value: 'b', isValid: true },
                    { value: 'c', isValid: true }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('date', () => {
                const validators = [
                    required(),
                    minValue(new Date(2016, 4, 13))
                ];

                [
                    { value: null, isValid: false },
                    { value: new Date(0), isValid: false },
                    { value: new Date(2016, 4, 12), isValid: false },
                    { value: new Date(2016, 4, 13), isValid: true },
                    { value: new Date(2016, 4, 14), isValid: true }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });
        });

        describe('with a max value', () => {
            describe('number', () => {
                const validators = [
                    required(),
                    maxValue(2)
                ];

                [
                    { value: null, isValid: false },
                    { value: 0, isValid: false },
                    { value: 1, isValid: true },
                    { value: 2, isValid: true },
                    { value: 3, isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('string', () => {
                const validators = [
                    required(),
                    maxValue('b')
                ];

                [
                    { value: null, isValid: false },
                    { value: '', isValid: false },
                    { value: 'a', isValid: true },
                    { value: 'b', isValid: true },
                    { value: 'c', isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });

            describe('date', () => {
                const validators = [
                    required(),
                    maxValue(new Date(2016, 4, 13))
                ];

                [
                    { value: null, isValid: false },
                    { value: new Date(0), isValid: false },
                    { value: new Date(2016, 4, 12), isValid: true },
                    { value: new Date(2016, 4, 13), isValid: true },
                    { value: new Date(2016, 4, 14), isValid: false }
                ].forEach((test) => {
                    it(JSON.stringify(test), () => {
                        const isValid = validation.isValid(test.value, validators);
                        expect(isValid).toBe(test.isValid);
                    });
                });
            });
        });
    });

    describe('for multiple fields', () => {
        describe('with exact values', () => {
            const validators = [
                fieldValue('first', 2),
                fieldValue('second', 2)
            ];

            [
                { first: 1, second: 1, isValid: false },
                { first: 2, second: 1, isValid: false },
                { first: 2, second: 2, isValid: true },
                { first: 3, second: 2, isValid: false },
                { first: 3, second: 3, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const isValid = validation.isValid(test, validators);
                    expect(isValid).toBe(test.isValid);
                });
            });
        });

        describe('with value ranges', () => {
            const validators = [
                fieldValue('first', 2, 3),
                fieldValue('second', 2, 3)
            ];

            [
                { first: 1, second: 1, isValid: false },
                { first: 2, second: 1, isValid: false },
                { first: 2, second: 2, isValid: true },
                { first: 3, second: 2, isValid: true },
                { first: 3, second: 3, isValid: true },
                { first: 4, second: 3, isValid: false },
                { first: 4, second: 4, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const isValid = validation.isValid(test, validators);
                    expect(isValid).toBe(test.isValid);
                });
            });
        });

        describe('with min and max values', () => {
            const validators = [
                minFieldValue('first', 2),
                maxFieldValue('second', 2)
            ];

            [
                { first: 1, second: 1, isValid: false },
                { first: 2, second: 1, isValid: true },
                { first: 2, second: 2, isValid: true },
                { first: 3, second: 2, isValid: true },
                { first: 3, second: 3, isValid: false }
            ].forEach((test) => {
                it(JSON.stringify(test), () => {
                    const isValid = validation.isValid(test, validators);
                    expect(isValid).toBe(test.isValid);
                });
            });
        });
    });
});
