import {isFalsyButNotZero} from './number';

export function parseString(value) {
    if (typeof value === 'string') {
        return value.trim();
    }

    if (isFalsyButNotZero(value)) {
        return '';
    }

    return String(value);
}
