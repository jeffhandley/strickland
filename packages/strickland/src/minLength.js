export default function minLength(minLengthProp, validatorProps) {
    if (typeof minLengthProp === 'object') {
        validatorProps = minLengthProp;

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
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let isValid = true;
        let length = value ? value.length : 0;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length < validationProps.minLength) {
            isValid = false;
        }

        return {
            ...validationProps,
            value,
            length,
            isValid
        };
    }
}
