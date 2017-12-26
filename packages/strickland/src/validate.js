import every from './every';
import props from './props';

export default function validate(rules, value, validateProps) {
    validateProps = {...validateProps};

    let result = true;

    if (Array.isArray(rules)) {
        rules = every(rules);
    } else if (typeof rules === 'object' && rules) {
        rules = props(rules);
    }

    if (typeof rules !== 'function') {
        throw 'unrecognized validation rules: ' + (typeof rules)
    }

    result = rules(value, validateProps);
    return prepareResult(value, validateProps, result);
}

function prepareResult(value, validateProps, result) {
    if (!result) {
        result = {
            isValid: false
        };
    } else if (typeof result === 'boolean') {
        result = {
            isValid: result
        };
    } else if (result instanceof Promise) {
        result = {
            isValid: false,
            resolvePromise: result
        };
    }

    if (result.resolvePromise) {
        result.resolvePromise = result.resolvePromise.then((resolved) => prepareResult(value, validateProps, resolved));

        if (validateProps.resolvePromise !== false) {
            return result.resolvePromise;
        }
    }

    return {
        ...validateProps,
        ...result,
        isValid: !!result.isValid,
        value
    };
}
