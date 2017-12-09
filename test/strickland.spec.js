import expect from 'expect';
import strickland, {isValid} from '../src';

describe('strickland', () => {
    it('returns valid results for null rules and data', () => {
        const rules = null;
        const data = null;

        const results = strickland(rules, data);

        expect(isValid(results)).toBe(true);
    });
});
