import validate from './validate';

export default function each(validators, validatorProps) {
    return function validateEach(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        const validateProps = {
            ...validationProps,
            resolvePromise: false
        };

        let result = {each: []};

        if (Array.isArray(validators)) {
            validators.forEach((validator) => {
                const nextResult = validate(validator, value, validateProps);
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
    if (result.each.some((eachResult) => eachResult.resolvePromise instanceof Promise)) {
        const promises = result.each.map((eachResult) =>
            eachResult.resolvePromise instanceof Promise ? eachResult.resolvePromise : Promise.resolve(eachResult)
        );

        let finalResult = {each: []};

        result.resolvePromise = Promise.all(promises).then((results) => {
            finalResult = results.reduce(applyNextResult, finalResult);
            return prepareResult(value, validationProps, finalResult);
        });
    }

    return {
        ...validationProps,
        ...result,
        value,
        isValid: !result.each.length || result.each.every((eachResult) => !!(eachResult.isValid))
    };
}
