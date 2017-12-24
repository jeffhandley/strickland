import every from './every';
import props from './props';

export default function validate(rules, value, validateProps) {
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
    }

    return {
        ...validateProps,
        ...result,
        isValid: !!result.isValid,
        value
    };
}
