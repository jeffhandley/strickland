import every from './every';
import props from './props';

export function isValid(result) {
    if (result === true) {
        return true;
    }

    if (typeof result === 'object') {
        return !!result.isValid;
    }

    return false;
}

export default function validate(rules, value, validateProps) {
    let result = true;

    if (typeof rules === 'function') {
        result = rules(value, validateProps);
    } else if (Array.isArray(rules)) {
        result = every(rules)(value, validateProps);
    } else if (typeof rules === 'object' && rules) {
        result = props(rules)(value, validateProps);
    } else {
        throw 'unrecognized validation rules: ' + (typeof rules)
    }

    result = convertResult(result, value);

    return result;
}

function convertResult(result, value) {
    if (typeof result === 'boolean') {
        result = {
            isValid: result
        };
    }

    if (typeof result === 'string') {
        result = {
            isValid: !result,
            message: result
        };
    }

    return {
        ...result,
        isValid: !!(result && result.isValid),
        value
    };
}

export {default as compare} from './compare';
export {default as length} from './length';
export {default as max} from './max';
export {default as maxLength} from './maxLength';
export {default as min} from './min';
export {default as minLength} from './minLength';
export {default as range} from './range';
export {default as required} from './required';
export {every, props};
