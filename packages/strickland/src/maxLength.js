export default function maxLength(maxLengthProp, validatorProps) {
    if (typeof maxLengthProp === 'object') {
        validatorProps = maxLengthProp;

    } else {
        validatorProps = {
            maxLength: maxLengthProp,
            ...validatorProps
        };
    }

    if (typeof validatorProps.maxLength !== 'number') {
        throw 'maxLength must be a number';
    }

    return function validateMaxLength(value, validationProps) {
        const mergedProps = {
            ...validatorProps,
            ...validationProps
        };

        let isValid = true;
        let length = value ? value.length : 0;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length > mergedProps.maxLength) {
            isValid = false;
        }

        return {
            ...mergedProps,
            value,
            length,
            isValid
        };
    }
}
