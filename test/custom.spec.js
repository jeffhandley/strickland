import expect from 'expect';
import custom from '../src/custom';

describe('custom', () => {
    describe('for empty values', () => {
        [
            { value: null, testName: 'null' },
            { value: false, testName: false },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`it recognizes the value (${testName}) as valid`, () => {
                const validate = custom(() => false);

                const result = validate(value);
                expect(result.isValid).toBe(true);
            });

            it(`it does not call the validate function for value (${testName})`, () => {
                let called = false;

                const validator = () => {
                    called = true;
                };

                const validate = custom(validator);
                validate(value);

                expect(called).toBe(false);
            })
        });
    });

    describe('calls the validate function', () => {
        it('and passes the value', () => {
            let validatedValue;
            const validator = (value) => {
                validatedValue = value;
                return false;
            };

            const validate = custom(validator);
            validate(4);

            expect(validatedValue).toBe(4);
        });

        it('and can set isValid to false', () => {
            const validator = () => false;
            const validate = custom(validator);
            const result = validate(true);

            expect(result.isValid).toBe(false);
        });

        it('and can set isValid to true', () => {
            const validator = () => true;
            const validate = custom(validator);
            const result = validate(false);

            expect(result.isValid).toBe(true);
        });

        it('and passes the props', () => {
            let validatedProps;
            const validator = (value, props) => {
                validatedProps = props;
            };

            const props = { errorLevel: 10, message: 'Custom' };
            const validate = custom(validator, props);
            validate(true);

            expect(validatedProps).toEqual(props);
        });

        it('but does not let the function mutate the props', () => {
            const validator = (value, props) => {
                props.mutated = true;
            };

            const props = { };
            const validate = custom(validator, props);
            validate(true);

            expect(props.mutated).toNotExist();
        });

        it('and uses a fresh copy of props for each call', () => {
            let mutated;

            const validator = (value, props) => {
                mutated = props.mutated;
                props.mutated = true;
            };

            const props = { };
            const validate = custom(validator, props);
            validate(true);

            expect(mutated).toNotExist();
        });
    });

    describe('message', () => {
        const validator = () => false;

        it('defaults to "Invalid"', () => {
            const validate = custom(validator);
            const result = validate('a');
            expect(result.message).toBe('Invalid');
        });

        it('can be overridden through props', () => {
            const validate = custom(validator, { message: 'Overridden' });
            const result = validate('a');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = custom(() => false, { errorLevel: 10 });
            const result = validate('a');
            expect(result.errorLevel).toBe(10);
        });
    });
});
