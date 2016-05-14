import expect from 'expect';
import exactvalue from '../src/exactvalue';

describe('exactvalue', () => {
    describe('recognizes empty values as valid', () => {
        const validate = exactvalue(1);

        [
            { value: null, testName: 'null' },
            { value: false, testName: false },
            { value: '', testName: 'empty string' }
        ].forEach(({ value, testName }) => {
            it(`(${testName})`, () => {
                const result = validate(value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values with the exact value as valid', () => {
        [
            { exact: 1, value: 1 },
            { exact: 1.2, value: 1.2 },
            { exact: 'a', value: 'a' },
            { exact: new Date(2016, 5, 14), value: new Date(2016, 5, 14) }
        ].forEach(({ exact, value }) => {
            it(`exact: ${exact}; value: ${value}`, () => {
                const validate = exactvalue(exact);
                const result = validate(value);
                console.log('value: ', value);
                expect(result.isValid).toBe(true);
            });
        });
    });

    describe('recognizes values less than expected as invalid', () => {
        [
            { exact: 2, value: 1, testName: '1' },
            { exact: 1.2, value: 1.1, testName: '1.1' },
            { exact: 'b', value: 'a', testName: 'a' },
            { exact: new Date(2016, 5, 14), value: new Date(2016, 5, 13), testName: '5/13/2016 (date)' }
        ].forEach(({ exact, value, testName }) => {
            it(`exact: ${exact}; value: ${testName}`, () => {
                const validate = exactvalue(exact);
                const result = validate(value);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('recognizes values greater than expected as invalid', () => {
        [
            { exact: 2, value: 3, testName: '3' },
            { exact: 1.2, value: 1.3, testName: '1.3' },
            { exact: 'b', value: 'c', testName: 'c' },
            { exact: new Date(2016, 5, 14), value: new Date(2016, 5, 15), testName: '5/15/2016 (date)' }
        ].forEach(({ exact, value, testName }) => {
            it(`exact: ${exact}; value: ${testName}`, () => {
                const validate = exactvalue(exact);
                const result = validate(value);
                expect(result.isValid).toBe(false);
            });
        });
    });

    describe('message', () => {
        it('defaults to "Exactly ${value}"', () => {
            const validate = exactvalue(4);
            const result = validate('a');
            expect(result.message).toBe('Exactly 4');
        });

        it('can be overridden through props', () => {
            const validate = exactvalue(4, { message: 'Overridden' });
            const result = validate('a');
            expect(result.message).toBe('Overridden');
        });
    });

    describe('props', () => {
        it('flow through', () => {
            const validate = exactvalue(4, { errorLevel: 10 });
            const result = validate('a');
            expect(result.errorLevel).toBe(10);
        });
    });
});
