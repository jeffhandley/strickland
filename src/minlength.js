import ValidationResult from './ValidationResult';

export default function minlength(min = 0, props = {}) {
    props.message = props.message || `At least ${min} characters`;

    return (value) => {
        const isValid = !value || value.length >= min;
        return new ValidationResult(isValid, props);
    };
}
