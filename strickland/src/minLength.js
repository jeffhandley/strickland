export default function minLengthValidator(validatorProps) {
    return function validateMinLength(value, context) {
        let length = value ? value.length : 0;
        let props;

        if (typeof validatorProps === 'function') {
            props = validatorProps({...context, length});
        } else if (typeof validatorProps === 'number') {
            props = {
                minLength: validatorProps
            };
        } else {
            props = validatorProps;
        }

        const {minLength} = props;

        if (typeof minLength !== 'number') {
            throw 'Strickland: The `minLength` validator requires a numeric `minLength` property';
        }

        let isValid = true;

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length < minLength) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            length
        };
    };
}
