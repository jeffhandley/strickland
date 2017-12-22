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
    if (result instanceof Promise) {
        return result.then((resolved) => prepareResult(value, validateProps, resolved));
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

export {default as compare} from './compare';
export {default as each} from './each';
export {default as length} from './length';
export {default as max} from './max';
export {default as maxLength} from './maxLength';
export {default as min} from './min';
export {default as minLength} from './minLength';
export {default as range} from './range';
export {default as required} from './required';
export {default as some} from './some';
export {every, props};
