import validate from './validate';

export default function every(validators, validatorProps) {
    return function validateEvery(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        const validateProps = {
            ...validationProps,
            resolvePromise: false
        };

        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.every((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value, validateProps);

                    currentResult = applyNextResult(currentResult, nextResult);

                    if (nextResult.resolvePromise instanceof Promise) {
                        const previousPromise = previousResult.resolvePromise || Promise.resolve(previousResult);

                        currentResult.resolvePromise = previousPromise.then((initialResult) =>
                            nextResult.resolvePromise.then((resolvedResult) => {
                                let finalResult = applyNextResult(initialResult, resolvedResult);

                                if (finalResult.isValid) {
                                    const remainingValidators = validatorsToExecute.slice(index + 1);
                                    finalResult = executeValidators(finalResult, remainingValidators);

                                    if (finalResult.resolvePromise) {
                                        return finalResult.resolvePromise;
                                    }
                                }

                                return prepareResult(value, validationProps, finalResult);
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

        return prepareResult(value, validationProps, result);
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

function prepareResult(value, validationProps, result) {
    validationProps.debug && validationProps.debug('prepareResult', result);

    return {
        ...validationProps,
        ...result,
        value,
        isValid: !result.every.length || result.every.every((everyResult) => !!(everyResult.isValid))
    };
}
