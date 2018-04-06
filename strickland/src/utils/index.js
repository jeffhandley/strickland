export function isEmptyValue(value) {
    // Consider 0 or boolean values as non-empty
    if (value === 0 || typeof value === 'boolean') {
        return false;
    }

    // Let JS determine the rest
    return !value;
}
