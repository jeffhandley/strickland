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

    if (typeof result.validateAsync === 'function') {
        return result.validateAsync();
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

        preparedResult.validateAsync = () => Promise.resolve(resultValidateAsync()).then(
            prepareResult.bind(null, value)
        );
    } else if (typeof preparedResult.validateAsync !== 'undefined') {
        throw 'Strickland: validateAsync must be either a Promise or a function';
    }

    return {
        ...preparedResult,
        isValid: !!preparedResult.isValid,
        value
    };
}
