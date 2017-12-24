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
    // When resolving, don't allow the resolvePromise prop to flow
    // Otherwise it could cause incomplete resolution
    // eslint-disable-next-line no-unused-vars
    const {resolvePromise, ...resolveProps} = validateProps;

    if (result instanceof Promise) {
        result.resolvePromise = result.then((resolved) => prepareResult(value, validateProps, resolved));

        if (resolvePromise !== false) {
            return result.resolvePromise;
        }
    }

    if (!result) {
        result = {
            isValid: false
        };
    } else if (typeof result === 'boolean') {
        result = {
            isValid: result
        };
    }

    return {
        ...validateProps,
        ...result,
        isValid: !!result.isValid,
        value
    };
}
