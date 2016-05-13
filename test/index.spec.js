import expect from 'expect';
import { isValid } from '../src';

describe('isValid', () => {
	it('returns true', () => {
		const actual = isValid();
		expect(actual).toBe(true);
	});
});
