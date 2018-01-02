import validate from './validate';

export default function each(validators, validatorContext) {
    return function validateEach(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext
        };

        let result = {each: []};
        let hasPromises = false;

        if (Array.isArray(validators)) {
            validators.forEach((validator) => {
                const nextResult = validate(validator, value, validationContext);
                hasPromises = hasPromises || nextResult.validateAsync instanceof Promise;

                result = applyNextResult(result, nextResult);
            });
        }

        if (hasPromises) {
            const promises = result.each.map((eachResult) =>
                eachResult.validateAsync instanceof Promise ? eachResult.validateAsync : Promise.resolve(eachResult)
            );

            let finalResult = {each: []};

            result.validateAsync = Promise.all(promises).then((results) => {
                finalResult = results.reduce(applyNextResult, finalResult);
                return prepareResult(value, validationContext, finalResult);
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
    return {
        ...validationContext,
        ...result,
        value,
        isValid: !result.each.length || result.each.every((eachResult) => !!(eachResult.isValid))
    };
}
