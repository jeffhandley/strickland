import validate from './strickland';

export default function each(validators, validatorProps) {
    return function validateEach(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {
            each: []
        };

        if (validators && validators.length) {
            validators.forEach((validator) => {
                const validatorResult = validate(validator, value, validationProps);

                result = {
                    ...result,
                    ...validatorResult,
                    each: [
                        ...result.each,
                        validatorResult
                    ]
                };
            });
        }

        return prepareResult(value, validationProps, result);
    }
}

function prepareResult(value, validationProps, result) {
    if (result.each.some((eachResult) => eachResult instanceof Promise)) {
        return Promise.all(result.each).then((resolvedResults) => {
            const flattenedResult = resolvedResults.reduce((previous, next) => ({
                ...previous,
                ...next
            }));

            return prepareResult(value, validationProps, {
                ...flattenedResult,
                each: resolvedResults
            });
        });
    }

    return {
        ...validationProps,
        ...result,
        isValid: result.each.every((eachResult) => !!(eachResult.isValid))
    };
}
