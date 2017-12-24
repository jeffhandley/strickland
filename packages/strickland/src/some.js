import validate from './validate';

export default function some(validators, validatorProps) {
    return function validateSome(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {
            some: []
        };

        if (Array.isArray(validators)) {
            validators.some((validator) => {
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
        some: [
            ...previousResult.some,
            nextResult
        ]
    };
}

function prepareResult(validationProps, result) {
    return {
        ...validationProps,
        ...result,
        isValid: !result.some.length || result.some.some((eachResult) => !!(eachResult.isValid))
    };
}
