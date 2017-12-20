let notDefined;

export default function required(validatorProps) {
    return function validateRequired(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
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
            ...validationProps,
            value,
            isValid
        };
    }
}
