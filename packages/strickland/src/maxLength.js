export default function maxLength(maxLengthValue) {
    return function validateMaxLength(value) {
        if (typeof maxLengthValue !== 'number') {
            throw 'maxLength must be a number';
        }

        let length = value ? value.length : 0;
        let isValid = true;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length > maxLengthValue) {
            isValid = false;
        }

        return {
            length,
            maxLength: maxLengthValue,
            isValid
        };
    }
}
