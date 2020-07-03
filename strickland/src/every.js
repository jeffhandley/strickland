import validate from './validate';

const initialResult = {
    isValid: true,
    every: []
};

export default function everyValidator(validators, validatorProps) {
    if (!validators || !Array.isArray(validators)) {
        throw 'Strickland: The `every` validator expects an array of validators';
    }

    return function validateEvery(value, validationContext) {
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
        }, reduceResultsCore);

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
        }, prepareResultCore.bind(null, middlewareContext));

        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.every((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value, context);

                    currentResult = reduceResults(currentResult, nextResult) || {};

                    if (nextResult.validateAsync) {
                        const previousAsync = previousResult.validateAsync || (() => Promise.resolve(previousResult));

                        currentResult.validateAsync = function resolveAsync() {
                            return previousAsync().then((resolvedPreviousResult) =>
                                nextResult.validateAsync().then((resolvedNextResult) => {
                                    let finalResult = reduceResults(resolvedPreviousResult, resolvedNextResult) || {};

                                    if (finalResult.isValid) {
                                        const remainingValidators = validatorsToExecute.slice(index + 1);
                                        finalResult = executeValidators(finalResult, remainingValidators);

                                        if (finalResult.validateAsync) {
                                            return finalResult.validateAsync();
                                        }
                                    }

                                    return prepareResult(finalResult);
                                })
                            );
                        };

                        // Break out of the loop to prevent subsequent validation from occurring
                        return false;
                    }

                    return currentResult.isValid;
                });
            }

            return currentResult;
        }

        const result = executeValidators(initialResult, validators);

        return prepareResult(result);
    };
}

function reduceResultsCore(previousResult, nextResult) {
    // be sure to guard against middleware failing to provide isValid and every
    return {
        ...previousResult,
        ...nextResult,
        isValid: !!previousResult.isValid && !!nextResult.isValid,
        every: [
            ...(previousResult.every || []),
            nextResult
        ]
    };
}

function prepareResultCore({props}, result) {
    return {
        ...props,
        ...result
    };
}
