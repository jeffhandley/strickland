import { every, filter, isArray, isObject, mapValues, keys } from 'lodash';

export function getResults(value, validators, invalidOnly) {
    if (isArray(validators)) {
        const results = validators.map((validator) => validator(value));

        if (invalidOnly) {
            return filter(results, (result) => !result.isValid);
        } else {
            return results;
        }
    } else if (isObject(validators)) {
        return mapValues(
            validators,
            (fieldValidators, field) => getResults(value && value[field], fieldValidators, invalidOnly)
        );
    } else {
        return [];
    }
}

export function validate(value, validators) {
    if (isArray(validators)) {
        const results = getResults(value, validators);

        return {
            results,
            errors: getErrorsFromResults(results),
            isValid: isValidFromResults(results)
        };
    } else if (isObject(validators)) {
        return mapValues(
            validators,
            (fieldValidators, field) => validate(value && value[field], fieldValidators)
        );
    } else {
        return {
            results: [],
            errors: [],
            isValid: true
        };
    }
}

export function getErrors(value, validators) {
    return getResults(value, validators, true);
}

export function getErrorsFromResults(results) {
    if (isArray(results)) {
        return filter(results, (result) => !result.isValid);
    } else if (isObject(results)) {
        return mapValues(results, getErrorsFromResults);
    } else {
        return [];
    }
}

export function isValidFromResults(results) {
    if (isArray(results)) {
        return every(results, (result) => result.isValid);
    }

    return every(keys(results), (field) => {
        return isValidFromResults(results[field]);
    });
}

export function isValid(value, validators) {
    const results = getResults(value, validators);
    return isValidFromResults(results);
}
