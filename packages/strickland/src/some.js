import validate from './strickland';

export default function some(validators, validatorProps) {
    return function validateSome(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        function executeValidators(currentResult, validatorsToExecute) {
            if (!validatorsToExecute || !validatorsToExecute.length) {
                return currentResult;
            }

            validatorsToExecute.some((validator, index) => {
                const previousResult = currentResult;
                const nextResult = validate(validator, value, validationProps);

                if (nextResult instanceof Promise) {
                    currentResult = nextResult.then((resolvedResult) =>
                        executeValidators(
                            applyNextResult(previousResult, resolvedResult),
                            validatorsToExecute.slice(index + 1)
                        )
                    );

                    // Break out of the some loop so the promise can be returned
                    return true;
                }

                currentResult = applyNextResult(previousResult, nextResult);
                return currentResult.isValid;
            });

            return currentResult;
        }

        const initialResult = {
            some: []
        };

        const result = executeValidators(initialResult, validators);
        return prepareResult(validationProps, result);
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

function prepareResult(validationProps, result) {
    if (result instanceof Promise) {
        return result.then((resolved) => prepareResult(validationProps, resolved));
    }

    return {
        ...validationProps,
        ...result,
        isValid: !result.some.length || result.some.some((eachResult) => !!(eachResult.isValid))
    };
}
