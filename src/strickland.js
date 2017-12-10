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
    return !!result.isValid;
}

export default function strickland(rules, data) {
    let result = true;

    if (typeof rules === 'function') {
        result = rules(data);
    }

    result = convertResult(result);

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

function convertObjectResult(result) {
    return {
        ...result,
        isValid: !!result.isValid
    };
}
