import validate from './validate';

export default function props(validators, validatorProps) {
    return function validateEach(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {props: {}};

        if (value && validators && typeof validators === 'object') {
            Object.keys(validators).forEach((propName) => {
                const nextResult = validate(validators[propName], value[propName], validationProps);
                result = applyNextResult(result, nextResult, propName);
            });
        }

        return prepareResult(value, validationProps, result);
    }
}

function applyNextResult(previousResult, nextResult, propName) {
    let resolvePromise;

    // If either result has a promise to resolve, then build an array
    // of promises to be resolved. Use actual results when not promises.

    if (nextResult.resolvePromise) {
        resolvePromise = {
            resolvePromise: [
                ...(previousResult.resolvePromise || []),
                Promise.resolve(nextResult.resolvePromise).then((propResult) => ({
                    propName,
                    propResult
                }))
            ]
        };
    }

    return {
        ...previousResult,
        ...resolvePromise,
        props: {
            ...previousResult.props,
            [propName]: nextResult
        }
    };
}

function prepareResult(value, validationProps, result) {
    let isValid = true;

    function resolvePromises(resultToResolve, propPromises) {
        // When resolving, don't allow the resolvePromise prop to flow
        // Otherwise it could cause incomplete resolution
        // eslint-disable-next-line no-unused-vars
        let {resolvePromise, ...finalResult} = resultToResolve;

        return Promise.all(propPromises).then((resolvedResults) => {
            resolvedResults.forEach(({propName, propResult}) => {
                finalResult.props[propName] = propResult;
            });

            return prepareResult(value, validationProps, finalResult);
        });
    }

    // If we have a deferred promise to resolve, then be sure to prepare the
    // final result after the promise is resolved
    if (result.resolvePromise) {
        result.resolvePromise = resolvePromises(result, result.resolvePromise);
    }

    // If any of the results returned a Promise, then return a top-level
    // Promise that resolves all of the results and prepares the final result
    const propPromises = [];

    Object.keys(result.props).forEach((propName) => {
        if (result.props[propName] instanceof Promise) {
            propPromises.push(result.props[propName].then((propResult) => ({
                propName,
                propResult
            })));
        } else {
            isValid = isValid && result.props[propName].isValid;
        }
    });

    if (propPromises.length) {
        return resolvePromises(result, propPromises);
    }

    return {
        ...validationProps,
        ...result,
        value,
        isValid
    };
}
