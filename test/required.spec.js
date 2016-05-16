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

    describe('ignoring values', () => {
        describe('by default, no values are ignored', () => {
            const validate = required();
            let notDefined;

            [ notDefined, null, false, 0, '' ]
            .forEach((test) => {
                describe(JSON.stringify(test), () => {
                    const result = validate(test);

                    it('setting isValid to false', () => {
                        expect(result.isValid).toBe(false);
                    });

                    it('setting isIgnored to false', () => {
                        expect(result.isIgnored).toBe(false);
                    });
                });
            });
        });

        describe('using a custom isIgnored prop', () => {
            [
                { isIgnored: true, name: 'as true' },
                { isIgnored: (val) => (val === 4), name: 'as a function returning true' }
            ]
            .forEach((test) => {
                describe(test.name, () => {
                    const validate = required({ isIgnored: test.isIgnored });
                    const result = validate(4);

                    it('setting isValid to true', () => {
                        expect(result.isValid).toBe(true);
                    });

                    it('setting isIgnored to true', () => {
                        expect(result.isIgnored).toBe(true);
                    });
                });
            });
        });
    });

    describe('treats non-empty values as valid', () => {
        const validate = required();

        [ true, 1, 'a', [ 1 ], { field: 1 }, new Date() ]
        .forEach((test) => {
            it(JSON.stringify(test), () => {
                const result = validate(test);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('treats empty values as not valid', () => {
        const validate = required();

        [ false, 0, '', [ ], { }, new Date(0) ]
        .forEach((test) => {
            it(JSON.stringify(test), () => {
                const result = validate(test);
                expect(result.isValid).toBe(false);
            });
        });
    });
});
