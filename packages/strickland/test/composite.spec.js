import expect from 'expect';
import composite from '../src/composite';
import validate, {required, minLength} from '../src/strickland';

describe('composite', () => {
    describe('takes an array of validators and props', () => {
        it('and validates them all', () => {
            const props = {minLength: 2};
            const rules = composite([required, minLength], props);

            const result = validate(rules, 'A');
            expect(result).toMatchObject({
                isValid: false,
                minLength: 2
            });
        });

        it('passing props like trim to all validators', () => {
            const props = {
                minLength: 8,
                trim: false
            };

            const rules = composite([required, minLength], props);
            const result = validate(rules, '        ');

            expect(result).toMatchObject({
                isValid: true,
                minLength: 8,
                parsedValue: '        '
            });
        });
    });
});
