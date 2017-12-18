import expect from 'expect';
import validate, {isValid} from '../src/strickland';

describe('validate', () => {
    describe('throws', () => {
        it('with an undefined rules function', () => {
            expect(() => validate()).toThrow();
        });

        it('with a null rules function', () => {
            expect(() => validate(null)).toThrow();
        });

        it('with a numeric rules function', () => {
            expect(() => validate(1)).toThrow();
        });

        it('with a string rules function', () => {
            expect(() => validate('string')).toThrow();
        });

        it('with an object rules function', () => {
            expect(() => validate({prop: 'value'})).toThrow();
        });
    });

    describe('with rules function', () => {
        describe('returning true', () => {
            const rules = () => true;
            const result = validate(rules, 'value');

            it('returns valid result', () => {
                expect(isValid(result)).toBe(true);
            });

            it('returns an object with isValid set to true', () => {
                expect(result.isValid).toBe(true);
            });
        });

        describe('returning false', () => {
            const rules = () => false;
            const result = validate(rules, 'value');

            it('returns invalid result', () => {
                expect(isValid(result)).toBe(false);
            });

            it('returns an object with isValid set to false', () => {
                expect(result.isValid).toBe(false);
            });
        });

        describe('returning a string', () => {
            describe('that is not empty', () => {
                const rules = () => 'That is not valid';
                const result = validate(rules, 'value');

                it('returns the string as the result message', () => {
                    expect(result.message).toEqual('That is not valid');
                });

                it('returns invalid result', () => {
                    expect(isValid(result)).toBe(false);
                });
            });

            describe('that is empty', () => {
                const rules = () => '';
                const result = validate(rules, 'value');

                it('returns a valid result ', () => {
                    expect(isValid(result)).toBe(true);
                });
            });
        });

        describe('returning an object', () => {
            it('returns an object with the rule result properties', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    customProp: 'This is a custom property'
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                const resultProps = {
                    message: result.message,
                    customProp: result.customProp
                };

                expect(resultProps).toEqual(ruleResult);
            });

            it('returns invalid result if the object is not marked as valid', () => {
                const ruleResult = {
                    message: 'That is not valid'
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(isValid(result)).toBe(false);
            });

            it('returns an object with isValid = false if the object does not specify isValid', () => {
                const ruleResult = {
                    message: 'That is not valid'
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(result.isValid).toBe(false);
            });

            describe('with isValid set to true', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: true
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                it('returns valid result', () => {
                    expect(isValid(result)).toBe(true);
                });

                it('returns an object with an isValid prop set to true', () => {
                    expect(result.isValid).toBe(true);
                });
            });

            it('returns an object with isValid = true if the object has isValid set to a truthy value other than true', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: 'Yep'
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(result.isValid).toBe(true);
            });

            it('returns invalid result if the object is marked as not valid', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: false
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(isValid(result)).toBe(false);
            });

            it('returns an object with isValid = false if the object has isValid set to a falsy value other than false', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: 0
                };

                const rules = () => ruleResult;
                const result = validate(rules, 'value');

                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('with rules array', () => {
        describe('with all rules returning valid results', () => {
            let secondCalled = false;

            const rules = [
                () => ({
                    isValid: true,
                    first: true
                }),
                () => {
                    secondCalled = true;

                    return {
                        isValid: true,
                        second: true
                    };
                }
            ];

            const result = validate(rules, 'value');

            it('returns a valid result', () => {
                expect(isValid(result)).toBe(true);
            });

            it('includes props from the first validator', () => {
                expect(result.first).toBe(true);
            });

            it('includes props from the second validator', () => {
                expect(result.second).toBe(true);
            });

            it('calls the second validator', () => {
                expect(secondCalled).toBe(true);
            });
        });

        describe('with the first rule returning an invalid result', () => {
            let secondCalled = false;

            const rules = [
                () => ({
                    isValid: false,
                    first: true
                }),
                () => {
                    secondCalled = true;

                    return {
                        isValid: true,
                        second: false
                    };
                }
            ];

            const result = validate(rules, 'value');

            it('returns an invalid result', () => {
                expect(isValid(result)).toBe(false);
            });

            it('includes props from the first validator on the result', () => {
                expect(result.first).toBe(true);
            });

            it('does not include props from the second validator', () => {
                expect(result.second).toBeUndefined();
            });

            it('does not call the second validator', () => {
                expect(secondCalled).toBe(false);
            });
        });
    });
});
