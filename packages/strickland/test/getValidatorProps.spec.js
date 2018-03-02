import {getValidatorProps} from '../src/utils';

describe('getValidatorProps', () => {
    describe('without context', () => {
        it('with a single prop value', () => {
            const props = getValidatorProps(['first'], [5], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5
            });
        });

        it('with a single prop function', () => {
            const props = getValidatorProps(['first'], [() => 5], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5
            });
        });

        it('with a props object and no named params', () => {
            const props = getValidatorProps([], [{message: 'Message'}], 6);
            expect(props).toMatchObject({
                value: 6,
                message: 'Message'
            });
        });

        it('with a props function and no named params', () => {
            const props = getValidatorProps([], [() => ({message: 'Message'})], 6);
            expect(props).toMatchObject({
                value: 6,
                message: 'Message'
            });
        });

        it('with a param value and a props object', () => {
            const props = getValidatorProps(['first'], [5, {message: 'Message'}], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with a param function and a props object', () => {
            const props = getValidatorProps(['first'], [() => 5, {message: 'Message'}], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with a param value and a props function', () => {
            const props = getValidatorProps(['first'], [5, () => ({message: 'Message'})], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with a param function and a props function', () => {
            const props = getValidatorProps(['first'], [() => 5, () => ({message: 'Message'})], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with two props objects', () => {
            const props = getValidatorProps(
                [],
                [
                    () => ({first: 5}),
                    () => ({message: 'Message'})
                ],
                6
            );

            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });
    });

    describe('value and context are passed', () => {
        it('to a param function, with a specified context object', () => {
            const param = jest.fn();
            getValidatorProps(['param'], [param], 6, {contextProp: 'Context'});

            expect(param).toHaveBeenCalledWith({
                value: 6,
                contextProp: 'Context'
            });
        });

        it('to a param function, overriding the default value with the context value', () => {
            const param = jest.fn();
            getValidatorProps(['param'], [param], 6, {contextProp: 'Context', value: 7});

            expect(param).toHaveBeenCalledWith(expect.objectContaining({
                value: 7
            }));
        });

        it('to a props function, without a specified context object', () => {
            const props = jest.fn();
            getValidatorProps(['param'], [5, props], 6);

            expect(props).toHaveBeenCalledWith({
                param: 5,
                value: 6
            });
        });

        it('to a props function, with a specified context object', () => {
            const props = jest.fn();
            getValidatorProps(['param'], [5, props], 6, {contextProp: 'Context'});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param: 5,
                contextProp: 'Context'
            });
        });

        it('to a props function, overriding the default prop with context value', () => {
            const props = jest.fn();
            getValidatorProps(['param'], [5, props], 6, {contextProp: 'Context', value: 7});

            expect(props).toHaveBeenCalledWith(expect.objectContaining({
                value: 7
            }));
        });

        it('to a props function, with a param function already resolved', () => {
            const props = jest.fn();
            getValidatorProps(['param'], [() => 5, props], 6, {contextProp: 'Context'});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param: 5,
                contextProp: 'Context'
            });
        });
    });

    describe('with default props passed', () => {
        it('to a param function, using the default prop value', () => {
            const param1 = jest.fn();
            getValidatorProps(['param1', 'param2'], [param1], 6, {contextProp: 'Context', value: 7}, {param2: 'default param2'});

            expect(param1).toHaveBeenCalledWith(expect.objectContaining({
                param2: 'default param2',
                value: 7
            }));
        });

        it('to a props function, without a specified context object', () => {
            const props = jest.fn();
            getValidatorProps(['param'], [props], 6, null, {param: 5});

            expect(props).toHaveBeenCalledWith({
                param: 5,
                value: 6
            });
        });

        it('to a props function, with a specified context object', () => {
            const props = jest.fn();
            getValidatorProps(['param'], [props], 6, {contextProp: 'Context'}, {param: 5});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param: 5,
                contextProp: 'Context'
            });
        });

        it('to a props function, overriding the default prop with context value', () => {
            const props = jest.fn();
            getValidatorProps(['param'], [props], 6, {contextProp: 'Context', param: 7}, {param: 5});

            expect(props).toHaveBeenCalledWith(expect.objectContaining({
                param: 7,
                value: 6
            }));
        });

        it('to a props function, with a param function already resolved', () => {
            const props = jest.fn();
            getValidatorProps(['param1', 'param2'], [() => 5, props], 6, {contextProp: 'Context'}, {param2: 7});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param1: 5,
                param2: 7,
                contextProp: 'Context'
            });
        });
    });
});
