import validate from './validate';

export default function some(validators) {
    return function validateSome(value) {
        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.some((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value);

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

                                return finalResult;
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

        let result = {
            isValid: true,
            some: []
        };

        result = executeValidators(result, validators);
        return result;
    }
}

function applyNextResult(previousResult, nextResult) {
    return {
        ...previousResult,
        ...nextResult,
        isValid: previousResult.isValid && nextResult.isValid,
        some: [
            ...previousResult.some,
            nextResult
        ]
    };
}
