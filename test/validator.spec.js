import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { validator } from '../src';

describe('validator', () => {
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

        it('guards against null', () => {
            const validate = validator(() => false, null);
            const result = validate({ field: 2 });
            expect(result.message).toExist();
        });

        describe('do not get mutated', () => {
            const props = { errorLevel: 10 };
            deepFreeze(props);

            it('during creation', () => {
                validator(() => false, props);
            });

            it('during validation', () => {
                const validate = validator(() => false, props);
                validate('a');
            });
        });
    });

    describe('ignores values', () => {
        it('ignoring falsy values by default', () => {
            const validate = validator(() => false);
            let notDefined;

            [ notDefined, null, false, 0, '' ]
            .forEach((test) => {
                describe(JSON.stringify(test), () => {
                    const result = validate(test);

                    it('setting isValid to true', () => {
                        expect(result.isValid).toBe(true);
                    });

                    it('setting isIgnored to true', () => {
                        expect(result.isIgnored).toBe(true);
                    });

                    it('and does not call the validation function', () => {
                        let called = false;

                        const validationFunction = () => {
                            called = true;
                        };

                        const validateWithCallTracking = validator(validationFunction);
                        validateWithCallTracking(test);

                        expect(called).toBe(false);
                    });
                });
            });
        });

        describe('using a custom isIgnored prop', () => {
            [ true, () => true ]
            .forEach((isIgnored) => {
                describe('with a value of true', () => {
                    const validate = validator(() => false, { isIgnored });
                    const result = validate(false);

                    it('setting isValid to true', () => {
                        expect(result.isValid).toBe(true);
                    });

                    it('setting isIgnored to true', () => {
                        expect(result.isIgnored).toBe(true);
                    });

                    it('and does not call the validation function', () => {
                        let called = false;

                        const validationFunction = () => {
                            called = true;
                        };

                        const validateWithCallTracking = validator(validationFunction, { isIgnored });
                        validateWithCallTracking(true);

                        expect(called).toBe(false);
                    });
                });
            });
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

        it('and sets isIgnored to false', () => {
            const validationFunction = () => false;
            const validate = validator(validationFunction);
            const result = validate(true);

            expect(result.isIgnored).toBe(false);
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

        it('and does not let the function mutate the props', () => {
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
});
