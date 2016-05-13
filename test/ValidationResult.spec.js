import expect from 'expect';
import ValidationResult from '../src/ValidationResult';

describe('ValidationResult', () => {
    describe('constructor', () => {
        it('sets the isValid property', () => {
            const result = new ValidationResult(true);
            expect(result.isValid).toBe(true);
        });

        it('sets the message property', () => {
            const result = new ValidationResult(true, 'message property is set');
            expect(result.message).toBe('message property is set');
        });

        it('sets props', () => {
            const props = { errorLevel: 10 };
            const result = new ValidationResult(false, null, props);
            expect(result.errorLevel).toBe(10);
        });

        describe('with props as the 2nd argument', () => {
            it('sets message', () => {
                const props = { message: 'from props' };
                const result = new ValidationResult(false, props);
                expect(result.message).toBe('from props');
            });

            it('sets props', () => {
                const props = { errorLevel: 10 };
                const result = new ValidationResult(false, props);
                expect(result.errorLevel).toBe(10);
            });
        });

        describe('with props as the 1st argument', () => {
            it('sets isValid', () => {
                const props = { isValid: true };
                const result = new ValidationResult(props);
                expect(result.isValid).toBe(true);
            });

            it('sets message', () => {
                const props = { message: 'from props' };
                const result = new ValidationResult(props);
                expect(result.message).toBe('from props');
            });

            it('sets props', () => {
                const props = { errorLevel: 10 };
                const result = new ValidationResult(props);
                expect(result.errorLevel).toBe(10);
            });
        });

        describe('forces isValue to be a boolean', () => {
            describe('when a truthy value is supplied', () => {
                it('directly', () => {
                    const result = new ValidationResult('valid');
                    expect(result.isValid).toBe(true);
                });

                it('through props', () => {
                    const result = new ValidationResult({ isValid: 'valid' });
                    expect(result.isValid).toBe(true);
                });
            });

            describe('when a falsey value is supplied', () => {
                it('directly', () => {
                    const result = new ValidationResult(0);
                    expect(result.isValid).toBe(false);
                });

                it('through props', () => {
                    const result = new ValidationResult({ isValid: 0 });
                    expect(result.isValid).toBe(false);
                });

                describe('by leaving it undefined', () => {
                    it('without props', () => {
                        const result = new ValidationResult();
                        expect(result.isValid).toBe(false);
                    });

                    it('with props', () => {
                        const result = new ValidationResult({ message: 'from props' });
                        expect(result.isValid).toBe(false);
                    });
                });
            });
        });
    });
});
