import deepFreeze from 'deep-freeze';
import compare from '../src/compare';

describe('compare', () => {
    describe('validates', () => {
        const validate = compare({compare: 3});

        it('with the value equal to the compare, it is valid', () => {
            const result = validate(3);
            expect(result.isValid).toBe(true);
        });

        it('with the value less than the compare, it is invalid', () => {
            const result = validate(2);
            expect(result.isValid).toBe(false);
        });

        it('with the value greater than the compare, it is invalid', () => {
            const result = validate(4);
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

        it('comparing against 0', () => {
            const validateAgainst0 = compare({compare: 0});
            const result = validateAgainst0(1);

            expect(result).toMatchObject({
                isValid: false,
                compare: 0
            });
        });

        it('with a value of 0', () => {
            const result = validate(0)

            expect(result).toMatchObject({
                isValid: false,
                compare: 3
            });
        });
    });

    describe('with a props argument', () => {
        const validate = compare({compare: 5, message: 'Custom message', isValid: false});
        const result = validate(5);

        it('uses the compare prop', () => {
            expect(result.compare).toBe(5);
        });

        it('spreads the other props onto the result', () => {
            expect(result.message).toBe('Custom message');
        });

        it('overrides the isValid prop with the validation result', () => {
            expect(result.isValid).toBe(true);
        });
    });

    describe('with a props function', () => {
        it('does not call the function during validator construction', () => {
            const getProps = jest.fn();
            getProps.mockReturnValue({compare: 6});

            compare(getProps);
            expect(getProps).not.toHaveBeenCalled();
        });

        it('the function is called at the time of validation', () => {
            const getProps = jest.fn();
            getProps.mockReturnValue({compare: 6});

            const validate = compare(getProps);
            validate(5);

            expect(getProps).toHaveBeenCalledTimes(1);
        });

        it('the function is called every time validation occurs', () => {
            const getProps = jest.fn();
            getProps.mockReturnValue({compare: 6});

            const validate = compare(getProps);
            validate(7);
            validate(7);

            expect(getProps).toHaveBeenCalledTimes(2);
        });

        it('validates using the function result', () => {
            const getCompareProps = jest.fn();
            getCompareProps.mockReturnValue({compare: 6});

            const validate = compare(getCompareProps);
            const result = validate(6);

            expect(result).toMatchObject({
                isValid: true,
                compare: 6
            });
        });

        it('validation context is passed to the function', () => {
            const getProps = jest.fn();
            getProps.mockReturnValue({compare: 6});

            const validate = compare(getProps);
            validate(6, {contextProp: 'validation context'});

            expect(getProps).toHaveBeenCalledWith(expect.objectContaining({
                contextProp: 'validation context'
            }));
        });
    });

    it('does not mutate props', () => {
        const props = {compare: 5};
        deepFreeze(props);

        expect(() => compare(props)(5)).not.toThrow();
    });

    describe('does not include validation context props on the result', () => {
        it('for new props', () => {
            const validate = compare({compare: 5});
            const result = validate(5, {contextProp: 'validation context'});

            expect(result).not.toHaveProperty('contextProp');
        });

        it('for props with the same name as other result props', () => {
            const validate = compare({compare: 5});
            const result = validate(5, {compare: 6});

            expect(result.compare).toBe(5);
        });
    });
});
