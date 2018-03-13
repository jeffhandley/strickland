let notDefined;

export default function requiredValidator(validatorProps) {
    return function validateRequired(value, context) {
        let props;

        if (typeof validatorProps === 'function') {
            props = validatorProps(context);
        } else if (typeof validatorProps === 'boolean') {
            props = {
                required: validatorProps
            };
        } else {
            props = validatorProps;
        }

        const {required = true} = props || {};
        let isValid = true;

        if (required) {
            if (value === null || value === notDefined) {
                isValid = false;

            } else if (typeof value === 'string') {
                isValid = !!value.length;

            } else if (typeof value === 'boolean') {
                isValid = value;
            }
        }

        return {
            ...props,
            isValid,
            required
        };
    }
}
