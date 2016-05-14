import ValidationResult from './ValidationResult';

export default function minvalue(min = 0, props = {}) {
    props.message = props.message || `At least ${min}`;

    return (value) => {
        const isValid = !value || value >= min;
        return new ValidationResult(isValid, props);
    };
}
