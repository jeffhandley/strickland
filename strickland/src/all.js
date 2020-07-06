import validate from './validate';

const initialResult = {
    isValid: true,
    all: []
};

export default function allValidator(validators, validatorProps) {
    if (!validators || !Array.isArray(validators)) {
        throw 'Strickland: The `all` validator expects an array of validators';
    }

    return function validateAll(value, validationContext) {
        const resolvedProps = typeof validatorProps === 'function' ?
            validatorProps(validationContext) :
            validatorProps;

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

        let result = initialResult;
        let hasAsyncResults = false;

        validators.forEach((validator) => {
            const nextResult = validate(validator, value, context);
            hasAsyncResults = hasAsyncResults || nextResult.validateAsync;

            // guard against middleware failing to return a result
            result = reduceResults(result, nextResult) || {};
        });

        if (hasAsyncResults) {
            result.validateAsync = function resolveAsync() {
                const promises = result.all.map(
                    (eachResult) => Promise.resolve(
                        eachResult.validateAsync ? eachResult.validateAsync() : eachResult
                    )
                );

                return Promise.all(promises).then((results) => {
                    const resolvedResult = results.reduce(reduceResults, initialResult);

                    return prepareResult(resolvedResult);
                });
            };
        }

        return prepareResult(result);
    };
}

function reduceResultsCore(accumulator, currentResult) {
    // Be sure to guard against middleware failing to provide `isValid` and `all`
    return {
        ...accumulator,
        ...currentResult,
        isValid: !!accumulator.isValid && !!currentResult.isValid,
        all: [
            ...(accumulator.all || []),
            currentResult
        ]
    };
}

function prepareResultCore(result, {props}) {
    return {
        ...props,
        ...result
    };
}
