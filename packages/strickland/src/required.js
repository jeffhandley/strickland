let notDefined;

export default function required(validatorContext) {
    return function validateRequired(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext
        };

        let isValid = true;

        if (value === null || value === notDefined) {
            isValid = false;
        } else if (typeof value === 'string') {
            isValid = !!value.length;
        } else if (typeof value === 'boolean') {
            isValid = value;
        }

        return {
            ...validationContext,
            required: true,
            value,
            isValid
        };
    }
}
