export {default as compare} from './compare';
export {default as max} from './max';
export {default as maxLength} from './maxLength';
export {default as min} from './min';
export {default as minLength} from './minLength';
export {default as range} from './range';
export {default as rangeLength} from './rangeLength';
export {default as required} from './required';
export {default as composite} from './composite';

export function isValid(result) {
    if (result === true) {
        return true;
    }

    if (typeof result === 'object') {
        return isValidObjectResult(result);
    }

    return false;
}

function isValidObjectResult(result) {
    if (typeof result.results === 'object') {
        const props = Object.keys(result.results);

        for (let i = 0; i < props.length; i++) {
            if (!isValid(result.results[props[i]])) {
                return false;
            }
        }

        return true;
    }

    return !!result.isValid;
}

export default function validate(rules, value, validateProps) {
    let result = true;

    if (typeof rules === 'function') {
        result = rules(value, validateProps);
    } else if (Array.isArray(rules)) {
        result = validateRulesArray(rules, value, validateProps);
    } else if (typeof rules === 'object' && rules) {
        result = validateRulesObject(rules, value, validateProps);
    } else {
        throw 'unrecognized validation rules: ' + (typeof rules)
    }

    result = convertResult(result, value);

    return result;
}

function validateRulesArray(rules, value, validateProps) {
    let result = true;

    for (let i = 0; i < rules.length; i++) {
        result = {
            ...result,
            ...validate(rules[i], value, validateProps)
        };

        if (!isValid(result)) {
            break;
        }
    }

    return result;
}

function validateRulesObject(rules, value, validateProps) {
    if (typeof value === 'object' && value) {
        const props = Object.keys(rules);
        let results = {};

        for (let i = 0; i < props.length; i++) {
            results = {
                ...results,
                [props[i]]: validate(rules[props[i]], value[props[i]], validateProps)
            };
        }

        // Wrap the results in an object to be nested in the outer result
        return {results};
    }

    return true;
}

function convertResult(result, value) {
    if (typeof result === 'boolean') {
        return convertBooleanResult(result);
    }

    if (typeof result === 'string') {
        return convertStringResult(result);
    }

    if (typeof result === 'object') {
        return convertObjectResult(result, value);
    }
}

function convertBooleanResult(result) {
    return {
        isValid: !!result
    };
}

function convertStringResult(result) {
    // If the string is empty, then there is no error message
    // and therefore the result is valid
    return {
        message: result,
        isValid: !result
    };
}

function convertObjectResult(result, value) {
    return {
        ...result,
        isValid: isValid(result),
        value
    };
}
