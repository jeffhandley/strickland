import validate from './validate';

export default function every(validators, validatorProps) {
    return function validateEvery(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        function executeValidators(currentResult, validatorsToExecute, executionProps) {
            if (!Array.isArray(validatorsToExecute) || !validatorsToExecute.length) {
                return currentResult;
            }

            validatorsToExecute.every((validator, index) => {
                // Capture the current result so we can resume from it when resolving
                const previousResult = currentResult;
                const nextResult = validate(validator, value, executionProps);

                function resolveResultPromise(promise) {
                    return promise.then((resolvedResult) => {
                        const finalResult = applyNextResult(previousResult, resolvedResult);

                        if (!finalResult.isValid) {
                            return finalResult;
                        }

                        // When resolving, don't allow the resolvePromise prop to flow
                        // Otherwise it could cause incomplete resolution
                        // eslint-disable-next-line no-unused-vars
                        const {resolvePromise, ...remainingProps} = executionProps;

                        return executeValidators(
                            applyNextResult(previousResult, resolvedResult),
                            validatorsToExecute.slice(index + 1),
                            remainingProps
                        );
                    });
                }

                if (nextResult instanceof Promise) {
                    currentResult = resolveResultPromise(nextResult);

                    // Break out of the loop so the promise can be returned
                    return false;
                }

                if (nextResult.resolvePromise instanceof Promise) {
                    nextResult.resolvePromise = resolveResultPromise(nextResult.resolvePromise);
                }

                currentResult = applyNextResult(currentResult, nextResult);
                return currentResult.isValid;
            });

            return currentResult;
        }

        const result = executeValidators({every: []}, validators, validationProps);
        return prepareResult(validationProps, result);
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

function prepareResult(validationProps, result) {
    if (result instanceof Promise) {
        return result.then((resolvedResult) => prepareResult(validationProps, resolvedResult));
    }

    if (result.resolvePromise instanceof Promise) {
        result.resolvePromise = result.resolvePromise.then((resolvedResult) => prepareResult(validationProps, resolvedResult));
    }

    return {
        ...validationProps,
        ...result,
        isValid: !result.every.length || result.every.every((eachResult) => !!(eachResult.isValid))
    };
}
