export default function minLength(minLengthProp, validatorProps) {
    if (typeof minLengthProp === 'object') {
        validatorProps = {
            ...minLengthProp
        };
    } else {
        validatorProps = {
            minLength: minLengthProp,
            ...validatorProps
        };
    }

    if (typeof validatorProps.minLength !== 'number') {
        throw 'minLength must be a number';
    }

    return function validateMinLength(value, validationProps) {
        const mergedProps = {
            ...validatorProps,
            ...validationProps
        };

        let isValid = true;
        let length = value ? value.length : 0;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length < mergedProps.minLength) {
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
