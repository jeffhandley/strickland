import validate from './strickland';

export default function every(validators, validatorProps) {
    return function validateEvery(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        function executeValidators(currentResult, validatorsToExecute) {
            if (!validatorsToExecute || !validatorsToExecute.length) {
                return currentResult;
            }

            validatorsToExecute.every((validator, index) => {
                const previousResult = currentResult;
                const nextResult = validate(validator, value, validationProps);

                if (nextResult instanceof Promise) {
                    currentResult = nextResult.then((resolvedResult) =>
                        executeValidators(
                            applyNextResult(previousResult, resolvedResult),
                            validatorsToExecute.slice(index + 1)
                        )
                    );

                    // Break out of the every loop so the promise can be returned
                    return false;
                }

                currentResult = applyNextResult(previousResult, nextResult);
                return currentResult.isValid;
            });

            return currentResult;
        }

        const initialResult = {
            every: [],
            isValid: true
        };

        const result = executeValidators(initialResult, validators);
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
        return result.then((resolved) => prepareResult(validationProps, resolved));
    }

    return {
        ...validationProps,
        ...result
    };
}
