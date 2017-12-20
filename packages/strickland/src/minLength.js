export default function minLength(minLengthProp, validatorProps) {
    if (typeof minLengthProp === 'object') {
        validatorProps = minLengthProp;

    } else {
        validatorProps = {
            minLength: minLengthProp,
            ...validatorProps
        };
    }

    return function validateMinLength(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let minLengthValue = validationProps.minLength;

        if (typeof minLengthValue === 'function') {
            minLengthValue = minLengthValue();
        }

        if (typeof minLengthValue !== 'number') {
            throw 'minLength must be a number';
        }

        let isValid = true;
        let length = value ? value.length : 0;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length < minLengthValue) {
            isValid = false;
        }

        return {
            ...validationProps,
            minLength: minLengthValue,
            value,
            length,
            isValid
        };
    }
}
