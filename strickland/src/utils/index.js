export function isFalsyButNotZero(value) {
    if (value === 0) {
        return false;
    }

    return !value;
}
