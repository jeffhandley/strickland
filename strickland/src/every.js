import validate from './validate';
import getMiddleware from './utils/middleware';

const initialResult = {
    isValid: true,
    every: []
};

export default function everyValidator(validators, validatorProps) {
    if (!validators || !Array.isArray(validators)) {
        throw 'Strickland: The `every` validator expects an array of validators';
    }

    return function validateEvery(value, validationContext) {
        const {context, reduceResults, prepareResult} = getMiddleware({
            value,
            validatorProps,
            validationContext,
            reduceResultsCore
        });

        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.every((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value, context);

                    // guard against middleware failing to return a result
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

function reduceResultsCore(accumulator, currentResult) {
    // Be sure to guard against middleware failing to provide `isValid` and `every`
    return {
        ...accumulator,
        ...currentResult,
        isValid: !!accumulator.isValid && !!currentResult.isValid,
        every: [
            ...(accumulator.every || []),
            currentResult
        ]
    };
}
