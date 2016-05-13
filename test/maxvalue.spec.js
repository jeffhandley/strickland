import expect from 'expect';
import maxvalue from '../src/maxvalue';

describe('maxvalue', () => {
    describe('recognizes empty values as valid', () => {
        const validate = maxvalue(1);

        [
            { value: null, testName: 'null' },
            { value: 0, testName: 0 },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = validate(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values at most max as valid', () => {
        [
            { max: 1, value: 1 },
            { max: 2, value: 2 },
            { max: 2, value: 1 },
            { max: 'a', value: 'a' },
            { max: 'b', value: 'b' },
            { max: 'b', value: 'a' }
        ].forEach(({ max, value }) => {
            it(`max: ${max}; value: ${value}`, () => {
                const validate = maxvalue(max);
                const result = validate(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values more than max as invalid', () => {
        [
            { max: 1, value: 2 },
            { max: 2, value: 3 },
            { max: 'a', value: 'b' },
            { max: 'b', value: 'c' }
        ].forEach(({ max, value }) => {
            it(`max: ${max}; value: ${value}`, () => {
                const validate = maxvalue(max);
                const result = validate(value);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "At most ${max}"', () => {
            const validate = maxvalue(4);
            const result = validate('a');
            expect(result.message).toBe('At most 4');
        });

        it('can be overridden through props as the 3rd argument', () => {
            const validate = maxvalue(4, { message: 'Overridden' });
            const result = validate('a');
            expect(result.message).toBe('Overridden');
        });

        it('can be overridden through props as the 2nd argument', () => {
            const validate = maxvalue({ max: 4, message: 'Overridden' });
            const result = validate('a');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = maxvalue({ errorLevel: 10 });
            const result = validate('a');
            expect(result.errorLevel).toBe(10);
        });
    });
});
