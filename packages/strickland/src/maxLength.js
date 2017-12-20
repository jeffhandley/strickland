export default function maxLength(maxLengthProp, validatorProps) {
    if (typeof maxLengthProp === 'object') {
        validatorProps = maxLengthProp;

    } else {
        validatorProps = {
            maxLength: maxLengthProp,
            ...validatorProps
        };
    }

    return function validateMaxLength(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let maxLengthValue = validationProps.maxLength;

        if (typeof maxLengthValue === 'function') {
            maxLengthValue = maxLengthValue();
        }

        if (typeof maxLengthValue !== 'number') {
            throw 'maxLength must be a number';
        }

        let isValid = true;
        let length = value ? value.length : 0;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length > maxLengthValue) {
            isValid = false;
        }

        return {
            ...validationProps,
            maxLength: maxLengthValue,
            value,
            length,
            isValid
        };
    }
}
