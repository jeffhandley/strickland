import ValidationResult from './ValidationResult';

export const message = 'Required';

export default function(value, props = {}) {
    props.message = props.message || message;

    const isValid = !!value;
    return new ValidationResult(isValid, props);
}
