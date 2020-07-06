function prepareResultCore(result, {props}) {
    return {
        ...props,
        ...result,
        isValid: !!result.isValid
    };
}

function resolveValidatorProps(validatorProps, validationContext) {
    return typeof validatorProps === 'function' ?
        validatorProps(validationContext) :
        validatorProps;
}

export default function getMiddleware({value, validatorProps, validationContext, reduceResultsCore}) {
    const resolvedProps = resolveValidatorProps(validatorProps, validationContext);

    const {middleware: middlewareFromProps, ...props} = resolvedProps || {};
    const {middleware: middlewareFromContext, ...context} = validationContext || {};

    const middlewares = [
        ...(middlewareFromProps ? (Array.isArray(middlewareFromProps) ? middlewareFromProps : [middlewareFromProps]) : []),
        ...(middlewareFromContext ? (Array.isArray(middlewareFromContext) ? middlewareFromContext : [middlewareFromContext]) : [])
    ];

    const reduceResultsMiddlewares = middlewares.map(({reduceResults}) => reduceResults).filter((reduceResults) => reduceResults);
    const prepareResultMiddlewares = middlewares.map(({prepareResult}) => prepareResult).filter((prepareResult) => prepareResult);

    const middlewareContext = {
        value,
        props,
        context
    };

    const reduceResults = reduceResultsMiddlewares.reduce((accumulatedReducer, nextReducer) => {
        return typeof nextReducer === 'function' ?
            ((previousResult, currentResult) => {
                const accumulatedResult = accumulatedReducer(previousResult, currentResult);

                return nextReducer(
                    accumulatedResult,
                    currentResult,
                    {
                        ...middlewareContext,
                        previousResult
                    }
                );
            }) : accumulatedReducer;
    }, (accumulator, currentResult) => reduceResultsCore(accumulator, currentResult, middlewareContext));

    const prepareResult = prepareResultMiddlewares.reduce((accumulatedPreparer, nextPreparer) => {
        return typeof nextPreparer === 'function' ?
            ((result) => {
                const preparedResult = accumulatedPreparer(result);

                return nextPreparer(
                    preparedResult,
                    {
                        ...middlewareContext,
                        validatorResult: result
                    }
                );
            }) : accumulatedPreparer;
    }, (result) => prepareResultCore(result, middlewareContext));

    return {
        props,
        context,
        reduceResults,
        prepareResult
    };
}
