import expect from 'expect';
import strickland, {isValid} from '../src/strickland';

describe('strickland', () => {
    describe('with rules: null', () => {
        describe('returns valid results', () => {
            it('for data: null', () => {
                const rules = null;
                const data = null;

                const results = strickland(rules, data);

                expect(isValid(results)).toBe(true);
            });

            it('for data: object', () => {
                const rules = null;
                const data = {first: 'Jeff'};

                const results = strickland(rules, data);

                expect(isValid(results)).toBe(true);
            });

            it('for data: string', () => {
                const rules = null;
                const data = 'Jeff';

                const results = strickland(rules, data);

                expect(isValid(results)).toBe(true);
            });

            it('for data: number', () => {
                const rules = null;
                const data = 34;

                const results = strickland(rules, data);

                expect(isValid(results)).toBe(true);
            });

            it('for data: true', () => {
                const rules = null;
                const data = true;

                const results = strickland(rules, data);
                expect(isValid(results)).toBe(true);
            });

            it('for data: false', () => {
                const rules = null;
                const data = false;

                const results = strickland(rules, data);
                expect(isValid(results)).toBe(true);
            });
        });
    });
});
