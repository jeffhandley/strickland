let notDefined;

export default function requiredValidator(validatorProps) {
    return function validateRequired(value, context) {
        let isValid = true;

        let props = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        if (typeof props === 'boolean') {
            props = {
                required: props
            };
        }

        const {required = true} = props || {};

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
