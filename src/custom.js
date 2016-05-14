import ValidationResult from './ValidationResult';

export default function custom(validate, props = {}) {
    props.message = props.message || 'Invalid';

    return (value) => {
        const isValid = !value || validate(value, Object.assign({}, props));
        return new ValidationResult(isValid, props);
    };
}
