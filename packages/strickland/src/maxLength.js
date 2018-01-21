export default function maxLength(maxLengthParam, validatorContext) {
    if (typeof maxLengthParam === 'object') {
        validatorContext = maxLengthParam;

    } else {
        validatorContext = {
            maxLength: maxLengthParam,
            ...validatorContext
        };
    }

    return function validateMaxLength(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext,
            value
        };

        let maxLengthValue = validationContext.maxLength;

        if (typeof maxLengthValue === 'function') {
            maxLengthValue = maxLengthValue(validationContext);
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
            ...validationContext,
            maxLength: maxLengthValue,
            length,
            isValid
        };
    }
}
