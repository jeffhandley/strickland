import {prepareProps} from '../src/utils';
let notDefined;

describe('prepareProps', () => {
    describe('without context', () => {
        it('with a single prop value', () => {
            const props = prepareProps({value: 6}, ['first'], [5]);
            expect(props).toMatchObject({
                value: 6,
                first: 5
            });
        });

        it('with a single prop function', () => {
            const props = prepareProps({value: 6}, ['first'], [() => 5]);
            expect(props).toMatchObject({
                value: 6,
                first: 5
            });
        });

        it('with a props object and no named params', () => {
            const props = prepareProps({value: 6}, [], [{message: 'Message'}]);
            expect(props).toMatchObject({
                value: 6,
                message: 'Message'
            });
        });

        it('with a props function and no named params', () => {
            const props = prepareProps({value: 6}, [], [() => ({message: 'Message'})]);
            expect(props).toMatchObject({
                value: 6,
                message: 'Message'
            });
        });

        it('with a param value and a props object', () => {
            const props = prepareProps({value: 6}, ['first'], [5, {message: 'Message'}]);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with a param function and a props object', () => {
            const props = prepareProps({value: 6}, ['first'], [() => 5, {message: 'Message'}]);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with a param value and a props function', () => {
            const props = prepareProps({value: 6}, ['first'], [5, () => ({message: 'Message'})]);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with a param function and a props function', () => {
            const props = prepareProps({value: 6}, ['first'], [() => 5, () => ({message: 'Message'})]);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with two props objects', () => {
            const props = prepareProps(
                {value: 6},
                [],
                [
                    () => ({first: 5}),
                    () => ({message: 'Message'})
                ]
            );

            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });
    });

    describe('default props and context are passed', () => {
        it('to a param function, without a specified context object', () => {
            const param = jest.fn();
            prepareProps({value: 6}, ['param'], [param], {contextProp: 'Context'});

            expect(param).toHaveBeenCalledWith({
                value: 6,
                contextProp: 'Context'
            });
        });

        it('to a param function, with a specified context object', () => {
            const param = jest.fn();
            prepareProps({value: 6}, ['param'], [param], {contextProp: 'Context'});

            expect(param).toHaveBeenCalledWith({
                value: 6,
                contextProp: 'Context'
            });
        });

        it('to a param function, overriding the default value with the context value', () => {
            const param = jest.fn();
            prepareProps({value: 6}, ['param'], [param], {contextProp: 'Context', value: 7});

            expect(param).toHaveBeenCalledWith(expect.objectContaining({
                value: 7
            }));
        });

        it('to a props function, without a specified context object', () => {
            const props = jest.fn();
            prepareProps({value: 6}, ['param'], [5, props]);

            expect(props).toHaveBeenCalledWith({
                param: 5,
                value: 6
            });
        });

        it('to a props function, with a specified context object', () => {
            const props = jest.fn();
            prepareProps({value: 6}, ['param'], [5, props], {contextProp: 'Context'});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param: 5,
                contextProp: 'Context'
            });
        });

        it('to a props function, overriding the default prop with context value', () => {
            const props = jest.fn();
            prepareProps({value: 6}, ['param'], [5, props], {contextProp: 'Context', value: 7});

            expect(props).toHaveBeenCalledWith(expect.objectContaining({
                value: 7
            }));
        });

        it('to a props function, with a param function already resolved', () => {
            const props = jest.fn();
            prepareProps({value: 6}, ['param'], [() => 5, props], {contextProp: 'Context'});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param: 5,
                contextProp: 'Context'
            });
        });
    });
});
