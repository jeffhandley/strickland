import validate from './validate';

const initialResult = {
    isValid: true,
    every: []
};

const defaultMiddleware = {
    reduceResults: (nextReducer, previousResult, nextResult, {value, props, context}) => nextReducer(previousResult, nextResult),
    prepareResult: (innerPrepareResult, result, {value, props, context}) => innerPrepareResult(result)
};

export default function everyValidator(validators, validatorProps) {
    if (!validators || !Array.isArray(validators)) {
        throw 'Strickland: The `every` validator expects an array of validators';
    }

    return function validateEvery(value, context) {
        const resolvedProps = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        const {middleware = {}, ...props} = resolvedProps || {};
        const {reduceResults = defaultMiddleware.reduceResults} = middleware;
        const {prepareResult = defaultMiddleware.prepareResult} = middleware;

        const middlewareProps = {
            value,
            props,
            context
        };

        const middlewareCore = {
            reduceResults: reduceResultsCore,
            prepareResult: prepareResultCore.bind(null, {props})
        };

        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.every((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value, context);

                    currentResult = reduceResults(
                        middlewareCore.reduceResults,
                        currentResult,
                        nextResult,
                        {
                            value,
                            props,
                            context
                        }
                    ) || {};

                    if (nextResult.validateAsync) {
                        const previousAsync = previousResult.validateAsync || (() => Promise.resolve(previousResult));

                        currentResult.validateAsync = function resolveAsync() {
                            return previousAsync().then((resolvedPreviousResult) =>
                                nextResult.validateAsync().then((resolvedNextResult) => {
                                    let finalResult = reduceResults(
                                        middlewareCore.reduceResults,
                                        resolvedPreviousResult,
                                        resolvedNextResult,
                                        {
                                            value,
                                            props,
                                            context
                                        }
                                    ) || {};

                                    if (finalResult.isValid) {
                                        const remainingValidators = validatorsToExecute.slice(index + 1);
                                        finalResult = executeValidators(finalResult, remainingValidators);

                                        if (finalResult.validateAsync) {
                                            return finalResult.validateAsync();
                                        }
                                    }

                                    return prepareResult(
                                        middlewareCore.prepareResult,
                                        finalResult,
                                        {
                                            value,
                                            props,
                                            context
                                        }
                                    );
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

        return prepareResult(
            middlewareCore.prepareResult,
            result,
            {
                value,
                props,
                context
            }
        );
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
