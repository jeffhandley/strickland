import expect from 'expect';
import validate, {isValid} from '../src/strickland';

describe('validate', () => {
    describe('with rules: null', () => {
        describe('returns valid result', () => {
            it('for data: null', () => {
                const result = validate(null, null);
                expect(isValid(result)).toBe(true);
            });

            it('for data: object', () => {
                const result = validate(null, {prop: 'value'});
                expect(isValid(result)).toBe(true);
            });

            it('for data: string', () => {
                const result = validate(null, 'Jeff');
                expect(isValid(result)).toBe(true);
            });

            it('for data: number', () => {
                const result = validate(null, 34);
                expect(isValid(result)).toBe(true);
            });

            it('for data: true', () => {
                const result = validate(null, true);
                expect(isValid(result)).toBe(true);
            });

            it('for data: false', () => {
                const result = validate(null, false);
                expect(isValid(result)).toBe(true);
            });
        });
    });

    describe('with rules function', () => {
        describe('returning true', () => {
            const rules = () => true;

            it('returns valid result', () => {
                const result = validate(rules, {prop: 'value'});
                expect(isValid(result)).toBe(true);
            });
        });

        describe('returning false', () => {
            const rules = () => false;

            it('returns invalid result', () => {
                const result = validate(rules, {prop: 'value'});
                expect(isValid(result)).toBe(false);
            });
        });

        describe('returning a string', () => {
            describe('that is not empty', () => {
                const rules = () => 'That is not valid';

                it ('returns the string as the result message', () => {
                    const result = validate(rules, {prop: 'value'});
                    expect(result.message).toEqual('That is not valid');
                });

                it('returns invalid result', () => {
                    const result = validate(rules, {prop: 'value'});
                    expect(isValid(result)).toBe(false);
                });
            });

            describe('that is empty', () => {
                const rules = () => '';

                it('returns a valid result ', () => {
                    const result = validate(rules, {prop: 'value'});
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

                const result = validate(rules, {prop: 'value'});

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

                const result = validate(rules, {prop: 'value'});
                expect(isValid(result)).toBe(false);
            });

            it('returns an object with an isValid prop set to false if the object does not specify isValid', () => {
                const ruleResult = {
                    message: 'That is not valid'
                };

                const rules = () => ruleResult;

                const result = validate(rules, {prop: 'value'});
                expect(result.isValid).toBe(false);
            });

            describe('with isValid set to true', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: true
                };

                const rules = () => ruleResult;

                it('returns valid result', () => {
                    const result = validate(rules, {prop: 'value'});
                    expect(isValid(result)).toBe(true);
                });

                it('returns an object with an isValid prop set to true', () => {
                    const result = validate(rules, {prop: 'value'});
                    expect(result.isValid).toBe(true);
                });
            });

            it('returns an object with an isValid prop set to true if the object has isValid set to a truthy value other than true', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: 'Yep'
                };

                const rules = () => ruleResult;

                const result = validate(rules, {prop: 'value'});
                expect(result.isValid).toBe(true);
            });

            it('returns invalid result if the object is marked as not valid', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: false
                };

                const rules = () => ruleResult;

                const result = validate(rules, {prop: 'value'});
                expect(isValid(result)).toBe(false);
            });

            it('returns an object with an isValid prop set to false if the object has isValid set to a falsy value other than false', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: 0
                };

                const rules = () => ruleResult;

                const result = validate(rules, {prop: 'value'});
                expect(result.isValid).toBe(false);
            });
        });
    });
});
