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
        validationContext = {
            ...validatorContext,
            ...validationContext,
            value
        };

        let minLengthValue = validationContext.minLength;

        if (typeof minLengthValue === 'function') {
            minLengthValue = minLengthValue(validationContext);
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
            ...validationContext,
            minLength: minLengthValue,
            length,
            isValid
        };
    }
}
