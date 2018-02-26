import validate from './validate';
import {prepareProps} from './utils';

const initialResult = {
    isValid: true,
    every: []
};

export default function every(validators, ...params) {
    return function validateEvery(value, context) {
        const validatorProps = prepareProps(
            {value},
            [],
            params,
            context
        );

        if (!validators || !validators.length) {
            return {
                ...validatorProps,
                ...initialResult
            };
        }

        function executeValidators(currentResult, validatorsToExecute) {
            if (Array.isArray(validatorsToExecute) && validatorsToExecute.length) {
                validatorsToExecute.every((validator, index) => {
                    const previousResult = currentResult;
                    const nextResult = validate(validator, value, context);

                    currentResult = applyNextResult(currentResult, nextResult);

                    if (nextResult.validateAsync instanceof Promise) {
                        const previousPromise = previousResult.validateAsync || Promise.resolve(previousResult);

                        currentResult.validateAsync = previousPromise.then((resolvedPreviousResult) =>
                            nextResult.validateAsync.then((resolvedNextResult) => {
                                let finalResult = applyNextResult(resolvedPreviousResult, resolvedNextResult);

                                if (finalResult.isValid) {
                                    const remainingValidators = validatorsToExecute.slice(index + 1);
                                    finalResult = executeValidators(finalResult, remainingValidators);

                                    if (finalResult.validateAsync) {
                                        return finalResult.validateAsync;
                                    }
                                }

                                return {
                                    ...validatorProps,
                                    ...finalResult
                                };
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

        const result = executeValidators(initialResult, validators);

        return {
            ...validatorProps,
            ...result
        };
    }
}

function applyNextResult(previousResult, nextResult) {
    return {
        ...previousResult,
        ...nextResult,
        isValid: previousResult.isValid && nextResult.isValid,
        every: [
            ...previousResult.every,
            nextResult
        ]
    };
}
