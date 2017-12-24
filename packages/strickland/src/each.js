import validate from './validate';

export default function each(validators, validatorProps) {
    return function validateEach(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {
            each: []
        };

        if (Array.isArray(validators)) {
            validators.forEach((validator) => {
                const nextResult = validate(validator, value, validationProps);
                result = applyNextResult(result, nextResult);
            });
        }

        return prepareResult(value, validationProps, result);
    }
}

function applyNextResult(previousResult, nextResult) {
    return {
        ...previousResult,
        ...nextResult,
        each: [
            ...previousResult.each,
            nextResult
        ]
    };
}

function prepareResult(value, validationProps, result) {
    return {
        ...validationProps,
        ...result,
        isValid: !result.each.length || result.each.every((eachResult) => !!(eachResult.isValid))
    };
}
