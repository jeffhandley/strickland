import ValidationResult from './ValidationResult';

export default function exactlength(length = 0, props = {}) {
    props.message = props.message || `Exactly ${length} characters`;

    return (value) => {
        const isValid = !value || value.length === length;
        return new ValidationResult(isValid, props);
    };
}
