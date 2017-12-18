import {isFalsyButNotZero} from './number';

export function parseString(value, options) {
    if (typeof value === 'string' && (!options || options.trim !== false)) {
        return value.trim();
    }

    if (isFalsyButNotZero(value)) {
        return '';
    }

    return String(value);
}
