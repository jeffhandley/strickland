import expect from 'expect';
import maxvalue from '../src/maxvalue';

describe('maxvalue', () => {
    describe('recognizes empty values as valid', () => {
        [
            { value: null, testName: 'null' },
            { value: 0, testName: 0 },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = maxvalue(value);
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
                const result = maxvalue(value, max);
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
                const result = maxvalue(value, max);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "At most ${max}"', () => {
            const result = maxvalue('a', 4);
            expect(result.message).toBe('At most 4');
        });

        it('can be overridden through props as the 3rd argument', () => {
            const result = maxvalue('a', 4, { message: 'Overridden' });
            expect(result.message).toBe('Overridden');
        });

        it('can be overridden through props as the 2nd argument', () => {
            const result = maxvalue('a', { max: 4, message: 'Overridden' });
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const result = maxvalue('a', { errorLevel: 10 });
            expect(result.errorLevel).toBe(10);
        });
    });
});
