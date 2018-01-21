export default function minLength(minLengthParam, validatorContext) {
    if (typeof minLengthParam === 'object') {
        validatorContext = minLengthParam;

    } else {
        validatorContext = {
            minLength: minLengthParam,
            ...validatorContext
        };
    }

    return function validateMinLength(value, validationContext) {
        let length = value ? value.length : 0;

        validationContext = {
            ...validatorContext,
            ...validationContext,
            value,
            length
        };

        let minLengthValue = validationContext.minLength;

        if (typeof minLengthValue === 'function') {
            minLengthValue = minLengthValue(validationContext);
        }

        if (typeof minLengthValue !== 'number') {
            throw 'minLength must be a number';
        }

        let isValid = true;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length < minLengthValue) {
            isValid = false;
        }

        return {
            ...validationContext,
            minLength: minLengthValue,
            isValid
        };
    }
}
