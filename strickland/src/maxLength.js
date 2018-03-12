export default function maxLengthValidator(validatorProps) {
    return function validateMaxLength(value, context) {
        let isValid = true;
        let length = value ? value.length : 0;

        const props = typeof validatorProps === 'function' ?
            validatorProps({...context, length}) :
            validatorProps;

        const {maxLength} = props;

        if (typeof maxLength !== 'number') {
            throw 'Strickland: The `maxLength` validator requires a numeric `maxLength` property';
        }

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
