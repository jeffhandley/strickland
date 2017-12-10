import expect from 'expect';
import strickland, {isValid} from '../src/strickland';

describe('strickland', () => {
    describe('with rules: null', () => {
        describe('returns valid result', () => {
            it('for data: null', () => {
                const rules = null;
                const data = null;

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(true);
            });

            it('for data: object', () => {
                const rules = null;
                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(true);
            });

            it('for data: string', () => {
                const rules = null;
                const data = 'Jeff';

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(true);
            });

            it('for data: number', () => {
                const rules = null;
                const data = 34;

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(true);
            });

            it('for data: true', () => {
                const rules = null;
                const data = true;

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(true);
            });

            it('for data: false', () => {
                const rules = null;
                const data = false;

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(true);
            });
        });
    });

    describe('with rules function', () => {
        describe('returning true', () => {
            it('returns valid result', () => {
                function rules() {
                    return true;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(true);
            });
        });

        describe('returning false', () => {
            it('returns invalid result', () => {
                function rules() {
                    return false;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(false);
            });
        });

        describe('returning a string', () => {
            it ('returns the string as the result message', () => {
                function rules() {
                    return 'That is not valid';
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(result.message).toEqual('That is not valid');
            });

            it('returns invalid result if the string is not empty', () => {
                function rules() {
                    return 'That is not valid';
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(false);
            });

            it('returns a valid result if the string is empty', () => {
                function rules() {
                    return '';
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(true);
            });
        });

        describe('returning an object', () => {
            it('returns an object with the rule result properties', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    customProp: 'This is a custom property'
                };

                function rules() {
                    return ruleResult;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
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

                function rules() {
                    return ruleResult;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(false);
            });

            it('returns an object with an isValid prop set to false if the object does not specify isValid', () => {
                const ruleResult = {
                    message: 'That is not valid'
                };

                function rules() {
                    return ruleResult;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(result.isValid).toBe(false);
            });

            it('returns valid result if the object is marked as valid', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: true
                };

                function rules() {
                    return ruleResult;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(true);
            });

            it('returns an object with an isValid prop set to true if the object has isValid set to true', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: true
                };

                function rules() {
                    return ruleResult;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(result.isValid).toBe(true);
            });

            it('returns an object with an isValid prop set to true if the object has isValid set to a truthy value other than true', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: 'Yep'
                };

                function rules() {
                    return ruleResult;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(result.isValid).toBe(true);
            });

            it('returns invalid result if the object is marked as not valid', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: false
                };

                function rules() {
                    return ruleResult;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(false);
            });

            it('returns an object with an isValid prop set to false if the object has isValid set to a falsy value other than false', () => {
                const ruleResult = {
                    message: 'That is not valid',
                    isValid: 0
                };

                function rules() {
                    return ruleResult;
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(result.isValid).toBe(false);
            });
        });
    });
});
