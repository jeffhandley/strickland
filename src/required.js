import ValidationResult from './ValidationResult';

export default function required(value, props = {}) {
    props.message = props.message || 'Required';

    const isValid = !!value;
    return new ValidationResult(isValid, props);
}
