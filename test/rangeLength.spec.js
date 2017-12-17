import expect from 'expect';
import rangeLength from '../src/rangeLength';

describe('rangeLength', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => rangeLength()).toThrow();
        });

        it('when the min length is a string', () => {
            expect(() => rangeLength('123', 456)).toThrow();
        });

        it('when the max length is a string', () => {
            expect(() => rangeLength(123, '456')).toThrow();
        });

        it('when props is an object without a min or a max', () => {
            expect(() => rangeLength({})).toThrow();
        });

        it('when props is an object without a min', () => {
            expect(() => rangeLength({ maxLength: 456 })).toThrow();
        });

        it('when props is an object without a max', () => {
            expect(() => rangeLength({ minLength: 123 })).toThrow();
        });
    });

    describe('with a single props argument', () => {
        const validate = rangeLength({minLength: 3, maxLength:5, message: 'Custom message'});
        const result = validate('1234');

        it('uses the min prop', () => {
            expect(result.minLength).toBe(3);
        });

        it('uses the max prop', () => {
            expect(result.maxLength).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = rangeLength(3, {maxLength: 5, message: 'Custom message'});
        const result = validate('1234');

        it('sets the min prop', () => {
            expect(result.minLength).toBe(3);
        });

        it('uses the max prop', () => {
            expect(result.maxLength).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first and second arguments as numbers and the third as an object', () => {
        const validate = rangeLength(3, 5, {message: 'Custom message'});
        const result = validate('1234');

        it('sets the min prop', () => {
            expect(result.minLength).toBe(3);
        });

        it('sets the max prop', () => {
            expect(result.maxLength).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    const validates = (description, validate) => describe(description, () => {
        describe('validates', () => {
            it('with the length equal to the min, it is valid', () => {
                const result = validate('123');
                expect(result.isValid).toBe(true);
            });

            it('with the length equal to the max, it is valid', () => {
                const result = validate('12345');
                expect(result.isValid).toBe(true);
            });

            it('with the length greater than the min and less than the max, it is valid', () => {
                const result = validate('1234');
                expect(result.isValid).toBe(true);
            });

            it('with the length less than the min, it is invalid', () => {
                const result = validate('12');
                expect(result.isValid).toBe(false);
            });

            it('with the length greater than the max, it is invalid', () => {
                const result = validate('123456');
                expect(result.isValid).toBe(false);
            });

            it('with an empty string, it is valid', () => {
                const result = validate('');
                expect(result.isValid).toBe(true);
            });

            it('with a null value, it is valid', () => {
                const result = validate(null);
                expect(result.isValid).toBe(true);
            });

            it('with an undefined value, it is valid', () => {
                const result = validate();
                expect(result.isValid).toBe(true);
            });
        });
    });

    validates('with numeric arguments', rangeLength(3, 5));
    validates('with a props argument', rangeLength({minLength: 3, maxLength: 5}));
    validates('with a numeric min and props', rangeLength(3, {maxLength: 5}));
    validates('with numeric min and max plus props', rangeLength(3, 5, {other: 'other'}));
});
