import expect from 'expect';
import ValidationResult from '../src/ValidationResult';

describe('ValidationResult', () => {
    describe('constructor', () => {
        it('sets the isValid property', () => {
            const result = new ValidationResult(true);
            expect(result.isValid).toBe(true);
        });

        it('sets props', () => {
            const props = { errorLevel: 10 };
            const result = new ValidationResult(false, props);
            expect(result.errorLevel).toBe(10);
        });

        describe('forces isValue to be a boolean', () => {
            describe('when a truthy value is supplied', () => {
                const result = new ValidationResult('valid');
                expect(result.isValid).toBe(true);
            });

            describe('when a falsy value is supplied', () => {
                const result = new ValidationResult(0);
                expect(result.isValid).toBe(false);
            });

            describe('when it is undefined', () => {
                const result = new ValidationResult();
                expect(result.isValid).toBe(false);
            });
        });
    });
});
