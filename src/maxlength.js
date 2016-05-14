import ValidationResult from './ValidationResult';

export default function maxlength(max = 0, props = {}) {
    props.message = props.message || `At most ${max} characters`;

    return (value) => {
        const isValid = !value || value.length <= max;
        return new ValidationResult(isValid, props);
    };
}
