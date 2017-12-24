import validate from './validate';

export default function each(validators, validatorProps) {
    return function validateEach(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {each: []};

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
    let resolvePromise;

    // If either result has a promise to resolve, then build an array
    // of promises to be resolved. Use actual results when not promises.
    if (previousResult.resolvePromise || nextResult.resolvePromise) {
        resolvePromise = {
            resolvePromise: [
                ...(previousResult.resolvePromise || previousResult.each),
                nextResult.resolvePromise || nextResult
            ]
        };
    }

    return {
        ...previousResult,
        ...nextResult,
        ...resolvePromise,
        each: [
            ...previousResult.each,
            nextResult
        ]
    };
}

function prepareResult(value, validationProps, result) {
    function resolvePromises(promises) {
        return Promise.all(promises).then((resolvedResults) => {
            let finalResult = resolvedResults.reduce(applyNextResult, {each: []});
            return prepareResult(value, validationProps, finalResult);
        });
    }

    // If we have a deferred promise to resolve, then be sure to prepare the
    // final result after the promise is resolved
    if (result.resolvePromise) {
        result.resolvePromise = resolvePromises(result.resolvePromise);
    }

    // If any of the results returned a Promise, then return a top-level
    // Promise that resolves all of the results and prepares the final result
    if (result.each.some((eachResult) => eachResult instanceof Promise)) {
        return resolvePromises(result.each);
    }

    return {
        ...validationProps,
        ...result,
        value,
        isValid: !result.each.length || result.each.every((eachResult) => !!(eachResult.isValid))
    };
}
