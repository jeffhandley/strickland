const VALID = [];
const INVALID_DEFAULT = 'Invalid';

export function isValid(result) {
    return (result === VALID);
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
