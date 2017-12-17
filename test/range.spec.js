import expect from 'expect';
import range from '../src/range';

describe('range', () => {
    describe('throws', () => {
        it('when props are not supplied', () => {
            expect(() => range()).toThrow();
        });

        it('when the min value is a string', () => {
            expect(() => range('123')).toThrow();
        });

        it('when the max value is a string', () => {
            expect(() => range(123, '456')).toThrow();
        });

        it('when props is an object without a min or a max', () => {
            expect(() => range({})).toThrow();
        });

        it('when props is an object without a min', () => {
            expect(() => range({ max: 456 })).toThrow();
        });

        it('when props is an object without a max', () => {
            expect(() => range({ min: 123 })).toThrow();
        });
    });

    describe('with a single props argument', () => {
        const validate = range({minValue: 3, maxValue:5, message: 'Custom message'});
        const result = validate(4);

        it('uses the min prop', () => {
            expect(result.minValue).toBe(3);
        });

        it('uses the max prop', () => {
            expect(result.maxValue).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = range(3, {maxValue: 5, message: 'Custom message'});
        const result = validate(4);

        it('sets the min prop', () => {
            expect(result.minValue).toBe(3);
        });

        it('uses the max prop', () => {
            expect(result.maxValue).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    describe('with the first and second arguments as numbers and the third as an object', () => {
        const validate = range(3, 5, {message: 'Custom message'});
        const result = validate(4);

        it('sets the min prop', () => {
            expect(result.minValue).toBe(3);
        });

        it('sets the max prop', () => {
            expect(result.maxValue).toBe(5);
        });

        it('retains extra props', () => {
            expect(result.message).toBe('Custom message');
        });
    });

    const validates = (description, validate) => describe(description, () => {
        describe('validates', () => {
            it('with the value equal to the min, it is valid', () => {
                const result = validate(3);
                expect(result.isValid).toBe(true);
            });

            it('with the value equal to the max, it is valid', () => {
                const result = validate(5);
                expect(result.isValid).toBe(true);
            });

            it('with the value greater than the min and less than the max, it is valid', () => {
                const result = validate(4);
                expect(result.isValid).toBe(true);
            });

            it('with the value less than the min, it is invalid', () => {
                const result = validate(2);
                expect(result.isValid).toBe(false);
            });

            it('with the value greater than the maxValue, it is invalid', () => {
                const result = validate(6);
                expect(result.isValid).toBe(false);
            });

            it('with a string value equal to the min, it is valid', () => {
                const result = validate('3');
                expect(result.isValid).toBe(true);
            });

            it('with a string value equal to the max, it is valid', () => {
                const result = validate('5');
                expect(result.isValid).toBe(true);
            });

            it('with a string value greater than the min and less than the max, it is valid', () => {
                const result = validate('4');
                expect(result.isValid).toBe(true);
            });

            it('with a string value less than the min, it is invalid', () => {
                const result = validate('2');
                expect(result.isValid).toBe(false);
            });

            it('with a string value greater than the max, it is invalid', () => {
                const result = validate('6');
                expect(result.isValid).toBe(false);
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

    validates('with numeric arguments', range(3, 5));
    validates('with a props argument', range({minValue: 3, maxValue: 5}));
    validates('with a numeric min and props', range(3, {maxValue: 5}));
    validates('with numeric min and max plus props', range(3, 5, {other: 'other'}));
});
