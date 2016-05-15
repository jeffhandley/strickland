import { every, filter } from 'lodash';

export function getResults(value, validators) {
    return validators.map((validate) => validate(value));
}

export function getErrors(value, validators) {
    const results = getResults(value, validators);
    return filter(results, (result) => !result.isValid);
}

export function isValid(value, validators) {
    const results = getResults(value, validators);
    return every(results, (result) => result.isValid);
}
