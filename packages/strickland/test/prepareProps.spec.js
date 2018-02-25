import prepareProps from '../src/prepareProps';
let notDefined;

describe('prepareProps', () => {
    describe('without context', () => {
        it('with a single prop value', () => {
            const props = prepareProps(['first'], [5], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5
            });
        });

        it('with a single prop function', () => {
            const props = prepareProps(['first'], [() => 5], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5
            });
        });

        it('with a props object and no named params', () => {
            const props = prepareProps([], [{message: 'Message'}], 6);
            expect(props).toMatchObject({
                value: 6,
                message: 'Message'
            });
        });

        it('with a props function and no named params', () => {
            const props = prepareProps([], [() => ({message: 'Message'})], 6);
            expect(props).toMatchObject({
                value: 6,
                message: 'Message'
            });
        });

        it('with a param value and a props object', () => {
            const props = prepareProps(['first'], [5, {message: 'Message'}], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with a param function and a props object', () => {
            const props = prepareProps(['first'], [() => 5, {message: 'Message'}], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with a param value and a props function', () => {
            const props = prepareProps(['first'], [5, () => ({message: 'Message'})], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with a param function and a props function', () => {
            const props = prepareProps(['first'], [() => 5, () => ({message: 'Message'})], 6);
            expect(props).toMatchObject({
                value: 6,
                first: 5,
                message: 'Message'
            });
        });

        it('with two props objects', () => {
            const props = prepareProps(
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

    describe('context is passed', () => {
        it('to a param function, without a specified context object', () => {
            const param = jest.fn();
            prepareProps(['param'], [param], 6);

            expect(param).toHaveBeenCalledWith({
                value: 6
            });
        });

        it('to a param function, with a specified context object', () => {
            const param = jest.fn();
            prepareProps(['param'], [param], 6, {contextProp: 'Context'});

            expect(param).toHaveBeenCalledWith({
                value: 6,
                contextProp: 'Context'
            });
        });

        it('to a param function, overriding the value context prop with the value', () => {
            const param = jest.fn();
            prepareProps(['param'], [param], 6, {contextProp: 'Context', value: 7});

            expect(param).toHaveBeenCalledWith({
                value: 6,
                contextProp: 'Context'
            });
        });

        it('to a props function, without a specified context object', () => {
            const props = jest.fn();
            prepareProps(['param'], [5, props], 6);

            expect(props).toHaveBeenCalledWith({
                param: 5,
                value: 6
            });
        });

        it('to a props function, with a specified context object', () => {
            const props = jest.fn();
            prepareProps(['param'], [5, props], 6, {contextProp: 'Context'});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param: 5,
                contextProp: 'Context'
            });
        });

        it('to a props function, overriding the value context prop with the value', () => {
            const props = jest.fn();
            prepareProps(['param'], [5, props], 6, {contextProp: 'Context', value: 7});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param: 5,
                contextProp: 'Context'
            });
        });


        it('to a props function, overriding the named param context prop with the named param value', () => {
            const props = jest.fn();
            prepareProps(['param'], [5, props], 6, {contextProp: 'Context', param: 7});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param: 5,
                contextProp: 'Context'
            });
        });

        it('to a props function, with a param function already resolved', () => {
            const props = jest.fn();
            prepareProps(['param'], [() => 5, props], 6, {contextProp: 'Context'});

            expect(props).toHaveBeenCalledWith({
                value: 6,
                param: 5,
                contextProp: 'Context'
            });
        });
    });
});
