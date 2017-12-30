import validate from './validate';

export default function each(validators, validatorContext) {
    return function validateEach(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext
        };

        const validateProps = {
            ...validationContext,
            async: false
        };

        let result = {each: []};

        if (Array.isArray(validators)) {
            validators.forEach((validator) => {
                const nextResult = validate(validator, value, validateProps);
                result = applyNextResult(result, nextResult);
            });
        }

        return prepareResult(value, validationContext, result);
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

function prepareResult(value, validationContext, result) {
    if (result.each.some((eachResult) => eachResult.async instanceof Promise)) {
        const promises = result.each.map((eachResult) =>
            eachResult.async instanceof Promise ? eachResult.async : Promise.resolve(eachResult)
        );

        let finalResult = {each: []};

        result.async = Promise.all(promises).then((results) => {
            finalResult = results.reduce(applyNextResult, finalResult);
            return prepareResult(value, validationContext, finalResult);
        });
    }

    return {
        ...validationContext,
        ...result,
        value,
        isValid: !result.each.length || result.each.every((eachResult) => !!(eachResult.isValid))
    };
}
