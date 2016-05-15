import expect from 'expect';
import { validator } from '../src';

describe('validator', () => {
    describe('for empty values', () => {
        [
            { value: null, testName: 'null' },
            { value: false, testName: false },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`it recognizes the value (${testName}) as valid`, () => {
                const validate = validator(() => false);

                const result = validate(value);
                expect(result.isValid).toBe(true);
            });

            it(`it does not call the validate function for value (${testName})`, () => {
                let called = false;

                const validationFunction = () => {
                    called = true;
                };

                const validate = validator(validationFunction);
                validate(value);

                expect(called).toBe(false);
            })
        });
    });

    describe('calls the validate function', () => {
        it('and passes the value', () => {
            let validatedValue;
            const validationFunction = (value) => {
                validatedValue = value;
                return false;
            };

            const validate = validator(validationFunction);
            validate(4);

            expect(validatedValue).toBe(4);
        });

        it('and can set isValid to false', () => {
            const validationFunction = () => false;
            const validate = validator(validationFunction);
            const result = validate(true);

            expect(result.isValid).toBe(false);
        });

        it('and can set isValid to true', () => {
            const validationFunction = () => true;
            const validate = validator(validationFunction);
            const result = validate(false);

            expect(result.isValid).toBe(true);
        });

        it('and passes the props', () => {
            let validatedProps;
            const validationFunction = (value, props) => {
                validatedProps = props;
            };

            const props = { errorLevel: 10, message: 'validationFunction' };
            const validate = validator(validationFunction, props);
            validate(true);

            expect(validatedProps).toInclude(props);
        });

        it('but does not let the function mutate the props', () => {
            const validationFunction = (value, props) => {
                props.mutated = true;
            };

            const props = { };
            const validate = validator(validationFunction, props);
            validate(true);

            expect(props.mutated).toNotExist();
        });

        it('and uses a fresh copy of props for each call', () => {
            let mutated;

            const validationFunction = (value, props) => {
                mutated = props.mutated;
                props.mutated = true;
            };

            const props = { };
            const validate = validator(validationFunction, props);
            validate(true);

            expect(mutated).toNotExist();
        });
    });

    describe('message', () => {
        const validationFunction = () => false;

        it('defaults to "Invalid"', () => {
            const validate = validator(validationFunction);
            const result = validate('a');
            expect(result.message).toBe('Invalid');
        });

        it('can be overridden through props', () => {
            const validate = validator(validationFunction, { message: 'Overridden' });
            const result = validate('a');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = validator(() => false, { errorLevel: 10 });
            const result = validate('a');
            expect(result.errorLevel).toBe(10);
        });
    });
});
