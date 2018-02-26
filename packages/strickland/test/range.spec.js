import deepFreeze from 'deep-freeze';
import range from '../src/range';

describe('range', () => {
    describe('with a single props argument', () => {
        const validate = range({min: 3, max: 5, message: 'Custom message', isValid: false});
        const result = validate(4);

        it('uses the min prop', () => {
            expect(result.min).toBe(3);
        });

        it('uses the max prop', () => {
            expect(result.max).toBe(5);
        });

        it('spreads the other props onto the result', () => {
            expect(result.message).toBe('Custom message');
        });

        it('overrides the isValid prop with the validation result', () => {
            expect(result.isValid).toBe(true);
        });
    });

    describe('with the first argument as a number and the second as an object', () => {
        const validate = range(3, {max: 5, message: 'Custom message', isValid: true});
        const result = validate(2);

        it('sets the min prop', () => {
            expect(result.min).toBe(3);
        });

        it('uses the max prop', () => {
            expect(result.max).toBe(5);
        });

        it('spreads the other props onto the result', () => {
            expect(result.message).toBe('Custom message');
        });

        it('overrides the isValid prop with the validation result', () => {
            expect(result.isValid).toBe(false);
        });
    });

    describe('with the first and second arguments as numbers and the third as an object', () => {
        const validate = range(3, 5, {message: 'Custom message', isValid: true});
        const result = validate(2);

        it('sets the min prop', () => {
            expect(result.min).toBe(3);
        });

        it('sets the max prop', () => {
            expect(result.max).toBe(5);
        });

        it('spreads the other props onto the result', () => {
            expect(result.message).toBe('Custom message');
        });

        it('overrides the isValid prop with the validation result', () => {
            expect(result.isValid).toBe(false);
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

            it('with the value greater than the max, it is invalid', () => {
                const result = validate(6);
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
    validates('with a props argument', range({min: 3, max: 5}));
    validates('with a numeric min and props', range(3, {max: 5}));
    validates('with numeric min and max plus props', range(3, 5, {other: 'other'}));

    describe('does not mutate props', () => {
        it('when a single props argument is used', () => {
            const props = {min: 3, max: 5};
            deepFreeze(props);

            expect(() => range(props)(4)).not.toThrow();
        });

        it('when a min range and props are used', () => {
            const props = {max: 5, message: 'Custom message'};
            deepFreeze(props);

            expect(() => range(3, props)(4)).not.toThrow();
        });

        it('when min and max values and props are used', () => {
            const props = {message: 'Custom message'};
            deepFreeze(props);

            expect(() => range(3, 5, props)(4)).not.toThrow();
        });
    });
});
