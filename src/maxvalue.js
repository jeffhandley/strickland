import ValidationResult from './ValidationResult';

export default function maxvalue(max = 0, props = {}) {
    props.message = props.message || `At most ${max}`;

    return (value) => {
        const isValid = !value || value <= max;
        return new ValidationResult(isValid, props);
    };
}
