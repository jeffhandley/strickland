import validate from './validate';

const initialResult = {
    isValid: true,
    some: []
};

export default function someValidator(validators, validatorProps) {
    if (!validators || !Array.isArray(validators)) {
        throw 'Strickland: some expects an array of validators';
    }

    return function validateSome(value, validationContext) {
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

        if (!validators || !validators.length) {
            return prepareResult({
                ...initialResult,
                isValid: true
            });
        }

        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.some((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value, context);

                    // guard against middleware failing to return a result
                    currentResult = reduceResults(currentResult, nextResult) || {};

                    if (nextResult.validateAsync) {
                        const previousAsync = previousResult.validateAsync || (() => Promise.resolve(previousResult));

                        currentResult.validateAsync = function resolveAsync() {
                            return previousAsync().then((asyncResult) =>
                                nextResult.validateAsync().then((resolvedResult) => {
                                    let finalResult = reduceResults(asyncResult, resolvedResult);

                                    if (!finalResult.isValid) {
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
                        return true;
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

function reduceResultsCore(accumulator, currentResult) {
    // Since the initial result has `isValid` as `true`, then we must verify
    // that there are already some results; otherwise, the || logic would
    // always result in valid results.
    const accumulatedSome = accumulator.some || [];
    const accumulatedIsValid = accumulatedSome.length && accumulator.isValid;

    // Be sure to guard against middleware failing to provide `isValid` and `some`
    return {
        ...accumulator,
        ...currentResult,
        isValid: !!accumulatedIsValid || !!currentResult.isValid,
        some: [
            ...accumulatedSome,
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
