import validate from './validate';

export default function some(validators, validatorContext) {
    return function validateSome(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext
        };

        const validateProps = {
            ...validationContext,
            async: false
        };

        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.some((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value, validateProps);

                    currentResult = applyNextResult(currentResult, nextResult);

                    if (nextResult.async instanceof Promise) {
                        const previousPromise = previousResult.async || Promise.resolve(previousResult);

                        currentResult.async = previousPromise.then((initialResult) =>
                            nextResult.async.then((resolvedResult) => {
                                let finalResult = applyNextResult(initialResult, resolvedResult);

                                if (!finalResult.isValid) {
                                    const remainingValidators = validatorsToExecute.slice(index + 1);
                                    finalResult = executeValidators(finalResult, remainingValidators);

                                    if (finalResult.async) {
                                        return finalResult.async;
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
