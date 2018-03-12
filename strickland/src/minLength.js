export default function minLengthValidator(validatorProps) {
    return function validateMinLength(value, context) {
        let isValid = true;
        let length = value ? value.length : 0;

        let props = typeof validatorProps === 'function' ?
            validatorProps({...context, length}) :
            validatorProps;

        if (typeof props === 'number') {
            props = {
                minLength: props
            };
        }

        const {minLength} = props;

        if (typeof minLength !== 'number') {
            throw 'Strickland: The `minLength` validator requires a numeric `minLength` property';
        }

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
    }
}
