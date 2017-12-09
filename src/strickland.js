const VALID = [];
const INVALID_DEFAULT = 'Invalid';

export function isValid(result) {
    if (result === VALID) {
        return true;
    }

    if (typeof result === 'object') {
        return isValidObjectResult(result);
    }

    return false;
}

function isValidObjectResult(result) {
    return !!result.isValid;
}

export default function strickland(rules, data) {
    let result = VALID;

    if (typeof rules === 'function') {
        const rulesResult = rules(data);
        result = convertResult(rulesResult);
    }

    return result;
}

function convertResult(result) {
    if (typeof result === 'boolean') {
        return convertBooleanResult(result);
    }

    if (typeof result === 'string') {
        return convertStringResult(result);
    }

    if (typeof result === 'object') {
        return convertObjectResult(result);
    }
}

function convertBooleanResult(result) {
    if (result === true) {
        return VALID;
    }

    return INVALID_DEFAULT;
}

function convertStringResult(result) {
    return result;
}

function convertObjectResult(result) {
    return result;
}
