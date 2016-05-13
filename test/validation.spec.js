import expect from 'expect';
import { maxlength, maxvalue, minlength, minvalue, required, validation } from '../src';

describe('validation', () => {
    const validators = [
        required({ message: 'required-validator' }),
        minlength(2, { message: 'minlength-validator' }),
        maxlength(2, { message: 'maxlength-validator' }),
        minvalue('aa', { message: 'minvalue-validator' }),
        maxvalue('bb', { message: 'maxvalue-validator' })
    ];

    describe('isValid', () => {
        it('can be used to determine if a value is valid', () => {
            const isValid = validation.isValid('ab', validators);
            expect(isValid).toBe(true);
        });

        it('can be used to determine if a value is invalid', () => {
            const isValid = validation.isValid('ccc', validators);
            expect(isValid).toBe(false);
        });
    });

    describe('getErrors', () => {
        describe('when a required value is empty', () => {
            const results = validation.getErrors('', validators);

            it('returns a single result', () => {
                expect(results.length).toBe(1);
            });

            it('has the "Required" message', () => {
                expect(results[0].message).toBe('required-validator');
            });
        });

        describe('when a non-empty value violates a single validator', () => {
            const results = validation.getErrors('cc', validators);

            it('returns a single result', () => {
                expect(results.length).toBe(1);
            });

            it('has the message from the validator that failed', () => {
                expect(results[0].message).toBe('maxvalue-validator');
            });
        });

        describe('when a value violates two validators', () => {
            const results = validation.getErrors('ccc', validators);

            it('returns two results', () => {
                expect(results.length).toBe(2);
            });

            it('has the messages from the validators that failed', () => {
                const messages = results.map((result) => result.message);
                expect(messages).toEqual([ 'maxlength-validator', 'maxvalue-validator' ]);
            });
        });
    });

    describe('getResults', () => {
        describe('when a required value is empty', () => {
            const results = validation.getResults('', validators);

            it('returns a result for each validator', () => {
                expect(results.length).toBe(validators.length);
            });

            it('has the isValid and message properties for all validators', () => {
                const details = results.map((result) => ({
                    isValid: result.isValid,
                    message: result.message
                }));

                expect(details).toEqual([
                    { isValid: false, message: 'required-validator' },
                    { isValid: true, message: 'minlength-validator' },
                    { isValid: true, message: 'maxlength-validator' },
                    { isValid: true, message: 'minvalue-validator' },
                    { isValid: true, message: 'maxvalue-validator' }
                ]);
            });
        });

        describe('when a non-empty value violates a single validator', () => {
            const results = validation.getResults('cc', validators);

            it('returns a result for each validator', () => {
                expect(results.length).toBe(validators.length);
            });

            it('has the isValid and message properties for all validators', () => {
                const details = results.map((result) => ({
                    isValid: result.isValid,
                    message: result.message
                }));

                expect(details).toEqual([
                    { isValid: true, message: 'required-validator' },
                    { isValid: true, message: 'minlength-validator' },
                    { isValid: true, message: 'maxlength-validator' },
                    { isValid: true, message: 'minvalue-validator' },
                    { isValid: false, message: 'maxvalue-validator' }
                ]);
            });
        });

        describe('when a value violates two validators', () => {
            const results = validation.getResults('ccc', validators);

            it('returns a result for each validator', () => {
                expect(results.length).toBe(validators.length);
            });

            it('has the isValid and message properties for all validators', () => {
                const details = results.map((result) => ({
                    isValid: result.isValid,
                    message: result.message
                }));

                expect(details).toEqual([
                    { isValid: true, message: 'required-validator' },
                    { isValid: true, message: 'minlength-validator' },
                    { isValid: false, message: 'maxlength-validator' },
                    { isValid: true, message: 'minvalue-validator' },
                    { isValid: false, message: 'maxvalue-validator' }
                ]);
            });
        });
    });
});
