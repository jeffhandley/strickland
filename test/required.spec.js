import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { required } from '../src';

describe('required', () => {
    describe('message', () => {
        it('defaults to "Required"', () => {
            const validate = required();
            const result = validate('ab');
            expect(result.message).toBe('Required');
        });

        it('can be overridden through props', () => {
            const validate = required({ message: 'Overridden' });
            const result = validate('ab');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = required({ errorLevel: 10 });
            const result = validate('ab');
            expect(result.errorLevel).toBe(10);
        });

        it('guards against null', () => {
            const validate = required(null);
            const result = validate('ab');
            expect(result.message).toExist();
        });

        describe('do not get mutated', () => {
            const props = { errorLevel: 10 };
            deepFreeze(props);

            it('during creation', () => {
                required(props);
            });

            it('during validation', () => {
                const validate = required(props);
                validate('ab');
            });
        });
    });

    describe('treats falsy values as invalid', () => {
        const validate = required();
        let notDefined;

        [ notDefined, null, false, 0, '' ]
        .forEach((test) => {
            it(JSON.stringify(test), () => {
                const result = validate(test);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('treats truthy values as valid', () => {
        const validate = required();

        [ true, 1, 'a', [ ], { } ]
        .forEach((test) => {
            it(JSON.stringify(test), () => {
                const result = validate(test);
                expect(result.isValid).toBe(true);
            });
        });
    });
});
