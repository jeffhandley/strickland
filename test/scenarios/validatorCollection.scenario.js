import expect from 'expect';
import { maxlength, maxvalue, minlength, minvalue, required } from '../../src';
import { every } from 'lodash';

describe('scenario tests', () => {
    describe('validator collections', () => {
        const validators = [
            required(),
            minlength(2),
            maxlength(2),
            minvalue('aa'),
            maxvalue('bb')
        ];


        it('can be used to determine if a value is valid', () => {
            const results = validators.map((validate) => validate('ab'));
            const isValid = every(results, (result) => result.isValid);
            expect(isValid).toBe(true);
        });

        it('can be used to determine if a value is invalid', () => {
            const results = validators.map((validate) => validate('ccc'));
            const isValid = every(results, (result) => result.isValid);
            expect(isValid).toBe(false);
        });
    });
});
