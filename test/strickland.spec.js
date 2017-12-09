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
            it('returns invalid result', () => {
                function rules() {
                    return 'That is not valid';
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(isValid(result)).toBe(false);
            });

            it ('returns the string', () => {
                function rules() {
                    return 'That is not valid';
                }

                const data = {first: 'Jeff'};

                const result = strickland(rules, data);
                expect(result).toEqual('That is not valid');
            });
        });
    });
});
