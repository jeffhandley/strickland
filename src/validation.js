import { every } from 'lodash';

export function isValid(value, validators) {
    var results = validators.map((validate) => validate(value));
    return every(results, (result) => result.isValid);
}

export function getResults(value, validators) {
    return validators.map((validate) => validate(value));
}

export function getErrors(value, validators) {
    return getResults(value, validators).filter((result) => !result.isValid);
}
