import every from './every';
import objectProps from './objectProps';

export default function validate(validator, value, context) {
    let result = true;

    if (Array.isArray(validator)) {
        validator = every(validator);
    } else if (typeof validator === 'object' && validator) {
        validator = objectProps(validator);
    }

    if (typeof validator !== 'function') {
        throw 'Strickland: The validator passed to validate must be a function, an array (to use every), or an object (to use objectProps). Validator type: ' + typeof(validator);
    }

    const validationContext = {
        ...context,
        value
    };

    result = validator(value, validationContext);
    return prepareResult(value, result);
}

export function validateAsync(validator, value, context) {
    const syncValue = typeof value === 'function' ?
        value() :
        value;

    const result = validate(validator, syncValue, context);

    if (typeof result.validateAsync === 'function') {
        return result.validateAsync(value, context);
    }

    return Promise.resolve(result);
}

function prepareResult(value, result) {
    let preparedResult = result;

    if (!preparedResult) {
        preparedResult = {isValid: false};

    } else if (typeof preparedResult === 'boolean') {
        preparedResult = {isValid: preparedResult};

    } else if (typeof preparedResult === 'function' || preparedResult instanceof Promise) {
        preparedResult = {
            isValid: false,
            validateAsync: preparedResult
        };
    }

    if (preparedResult.validateAsync instanceof Promise) {
        const promise = preparedResult.validateAsync;
        preparedResult.validateAsync = () => promise;
    }

    if (typeof preparedResult.validateAsync === 'function') {
        const resultValidateAsync = preparedResult.validateAsync;

        preparedResult.validateAsync = function resolveAsync(asyncValue, asyncContext) {
            return Promise.resolve(resultValidateAsync(value, asyncContext))
                .then(prepareResult.bind(null, value))
                .then((asyncResult) => {
                    if (typeof asyncValue === 'function') {
                        const resolvedAsyncValue = asyncValue();

                        // If the value changed during async validation
                        // then reject the async result
                        if (asyncResult.value !== resolvedAsyncValue) {
                            throw asyncResult;
                        }
                    }

                    return asyncResult;
                });
        }
    } else if (typeof preparedResult.validateAsync !== 'undefined') {
        throw 'Strickland: validateAsync must be either a Promise or a function';
    }

    return {
        ...preparedResult,
        isValid: !!preparedResult.isValid,
        value
    };
}
