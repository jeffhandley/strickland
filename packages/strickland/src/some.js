import validate from './validate';

export default function some(validators, validatorContext) {
    return function validateSome(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext
        };

        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.some((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value, validationContext);

                    currentResult = applyNextResult(currentResult, nextResult);

                    if (nextResult.validateAsync instanceof Promise) {
                        const previousPromise = previousResult.validateAsync || Promise.resolve(previousResult);

                        currentResult.validateAsync = previousPromise.then((initialResult) =>
                            nextResult.validateAsync.then((resolvedResult) => {
                                let finalResult = applyNextResult(initialResult, resolvedResult);

                                if (!finalResult.isValid) {
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
                        return true;
                    }

                    return currentResult.isValid;
                });
            }

            return currentResult;
        }

        let result = {some: []};
        result = executeValidators(result, validators);

        return prepareResult(value, validationContext, result);
    }
}

function applyNextResult(previousResult, nextResult) {
    return {
        ...previousResult,
        ...nextResult,
        some: [
            ...previousResult.some,
            nextResult
        ]
    };
}

function prepareResult(value, validationContext, result) {
    return {
        ...validationContext,
        ...result,
        value,
        isValid: !result.some.length || result.some.some((everyResult) => !!(everyResult.isValid))
    };
}
