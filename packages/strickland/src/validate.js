import every from './every';
import props from './props';

export default function validate(validator, value, context) {
    let result = true;

    if (Array.isArray(validator)) {
        validator = every(validator);
    } else if (typeof validator === 'object' && validator) {
        validator = props(validator);
    }

    if (typeof validator !== 'function') {
        throw 'Strickland: The validator passed to validate must be a function, an array (to use every), or an object (to use props). Validator type: ' + typeof(validator);
    }

    const validationContext = {
        ...context
    };

    result = validator(value, validationContext);
    return prepareResult(value, result);
}

export function validateAsync(...validateParams) {
    const result = validate(...validateParams);

    if (result.validateAsync instanceof Promise) {
        return result.validateAsync;
    }

    return Promise.resolve(result);
}

function prepareResult(value, result) {
    if (!result) {
        result = {isValid: false};

    } else if (typeof result === 'boolean') {
        result = {isValid: result};

    } else if (result instanceof Promise) {
        result = {
            isValid: false,
            validateAsync: result
        };
    }

    if (typeof result.validateAsync !== 'undefined') {
        if (result.validateAsync instanceof Promise) {
            result.validateAsync = result.validateAsync.then(prepareResult.bind(null, value));
        } else {
            throw 'Strickland: The validator returned a `validateAsync` prop that was not a Promise';
        }
    }

    return {
        ...result,
        isValid: !!result.isValid,
        value
    };
}
