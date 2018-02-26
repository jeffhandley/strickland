import deepFreeze from 'deep-freeze';
import compare, {prepareProps} from '../src/compare';

describe('compare', () => {
    describe('validates', () => {
        const validate = compare(3);

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
            const validateAgainst0 = compare(0);
            const result = validateAgainst0(1);

            expect(result).toMatchObject({
                isValid: false,
                compare: 0,
                value: 1
            });
        });

        it('with a value of 0', () => {
            const result = validate(0)

            expect(result).toMatchObject({
                isValid: false,
                compare: 3,
                value: 0
            });
        });
    });

    describe('with a single props argument', () => {
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

    describe('with the first argument as a number and the second as an object', () => {
        const validate = compare(5, {message: 'Custom message', isValid: true});
        const result = validate(4);

        it('sets the compare result prop', () => {
            expect(result.compare).toBe(5);
        });

        it('spreads the other props onto the result', () => {
            expect(result.message).toBe('Custom message');
        });

        it('overrides the isValid prop with the validation result', () => {
            expect(result.isValid).toBe(false);
        });
    });

    describe('with a function passed to the validator', () => {
        it('does not call the function during validator construction', () => {
            const getCompareValue = jest.fn();
            getCompareValue.mockReturnValue(6);

            compare(getCompareValue);
            expect(getCompareValue).not.toHaveBeenCalled();
        });

        it('the function is called at the time of validation', () => {
            const getCompareValue = jest.fn();
            getCompareValue.mockReturnValue(6);

            const validate = compare(getCompareValue);
            validate(5);

            expect(getCompareValue).toHaveBeenCalledTimes(1);
        });

        it('the function is called every time validation occurs', () => {
            const getCompareValue = jest.fn();
            getCompareValue.mockReturnValue(6);

            const validate = compare(getCompareValue);
            validate(7);
            validate(7);

            expect(getCompareValue).toHaveBeenCalledTimes(2);
        });

        describe('validates using the function result', () => {
            it('when the function returns a compare value', () => {
                const getCompareValue = jest.fn();
                getCompareValue.mockReturnValue(6);

                const validate = compare(getCompareValue);
                const result = validate(6);

                expect(result).toMatchObject({
                    isValid: true,
                    compare: 6,
                    value: 6
                });
            });

            it('when the function returns a props object', () => {
                const getCompareProps = jest.fn();
                getCompareProps.mockReturnValue({compare: 6});

                const validate = compare(getCompareProps);
                const result = validate(6);

                expect(result).toMatchObject({
                    isValid: true,
                    compare: 6,
                    value: 6
                });
            });
        });

        it('validation context is passed to the function', () => {
            const getCompareValue = jest.fn();
            getCompareValue.mockReturnValue(6);

            const validate = compare(getCompareValue);
            validate(6, {contextProp: 'validation context'});

            expect(getCompareValue).toHaveBeenCalledWith(expect.objectContaining({
                value: 6,
                contextProp: 'validation context'
            }));
        });
    });

    describe('does not mutate props', () => {
        it('when a single props argument is used', () => {
            const props = {compare: 5};
            deepFreeze(props);

            expect(() => compare(props)(5)).not.toThrow();
        });

        it('when a compare value and props are used', () => {
            const props = {message: 'Custom message'};
            deepFreeze(props);

            expect(() => compare(5, props)(5)).not.toThrow();
        });
    });

    describe('does not include validation context props on the result', () => {
        it('for new props', () => {
            const validate = compare(5);
            const result = validate(5, {contextProp: 'validation context'});

            expect(result).not.toHaveProperty('contextProp');
        });

        it('for props with the same name as other result props', () => {
            const validate = compare(5);
            const result = validate(5, {compare: 6});

            expect(result.compare).toBe(5);
        });
    });
});
