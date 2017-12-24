import validate from './validate';

export default function every(validators, validatorProps) {
    return function validateEvery(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {
            every: []
        };

        if (Array.isArray(validators)) {
            validators.every((validator) => {
                const nextResult = validate(validator, value, validationProps);
                result = applyNextResult(result, nextResult);

                return result.isValid;
            });
        }

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
    return {
        ...validationProps,
        ...result,
        isValid: !result.every.length || result.every.every((eachResult) => !!(eachResult.isValid))
    };
}
