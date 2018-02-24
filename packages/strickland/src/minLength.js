export default function minLength(minLengthValue) {
    return function validateMinLength(value) {
        if (typeof minLengthValue !== 'number') {
            throw 'minLength must be a number';
        }

        let length = value ? value.length : 0;
        let isValid = true;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length < minLengthValue) {
            isValid = false;
        }

        return {
            length,
            minLength: minLengthValue,
            isValid
        };
    }
}
