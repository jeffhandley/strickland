export default function maxLengthValidator(validatorProps) {
    return function validateMaxLength(value, context) {
        let length = value ? value.length : 0;
        let props;

        if (typeof validatorProps === 'function') {
            props = validatorProps({...context, length});
        } else if (typeof validatorProps === 'number') {
            props = {
                maxLength: validatorProps
            };
        } else {
            props = validatorProps
        }

        const {maxLength} = props;

        if (typeof maxLength !== 'number') {
            throw 'Strickland: The `maxLength` validator requires a numeric `maxLength` property';
        }

        let isValid = true;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length > maxLength) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            length
        };
    }
}
