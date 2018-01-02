import validate from './validate';

export default function every(validators, validatorContext) {
    return function validateEvery(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext
        };

        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.every((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value, validationContext);

                    currentResult = applyNextResult(currentResult, nextResult);

                    if (nextResult.validateAsync instanceof Promise) {
                        const previousPromise = previousResult.validateAsync || Promise.resolve(previousResult);

                        currentResult.validateAsync = previousPromise.then((initialResult) =>
                            nextResult.validateAsync.then((resolvedResult) => {
                                let finalResult = applyNextResult(initialResult, resolvedResult);

                                if (finalResult.isValid) {
                                    const remainingValidators = validatorsToExecute.slice(index + 1);
                                    finalResult = executeValidators(finalResult, remainingValidators);

                                    if (finalResult.validateAsync) {
                                        return finalResult.validateAsync;
                                    }
                                }

                                return prepareResult(value, validationContext, finalResult);
                            })
                        );

                        // Break out of the loop to prevent subsequent validation from occurring
                        return false;
                    }

                    return currentResult.isValid;
                });
            }

            return currentResult;
        }

        let result = {every: []};
        result = executeValidators(result, validators);

        return prepareResult(value, validationContext, result);
    }
}

function applyNextResult(previousResult, nextResult) {
    return {
        ...previousResult,
        ...nextResult,
        every: [
            ...previousResult.every,
            nextResult
        ]
    };
}

function prepareResult(value, validationContext, result) {
    return {
        ...validationContext,
        ...result,
        value,
        isValid: !result.every.length || result.every.every((everyResult) => !!(everyResult.isValid))
    };
}
