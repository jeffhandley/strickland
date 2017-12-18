export function isFalsyButNotZero(value) {
    if (value === 0) {
        return false;
    }

    return !value;
}

export function parseNumber(value) {
    if (isFalsyButNotZero(value)) {
        return value;
    }

    return Number(value);
}
