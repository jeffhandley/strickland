import ValidationResult from './ValidationResult';

export default function validator(validate, props) {
    props = props || {};
    props.message = props.message || 'Invalid';

    return (value) => {
        // Only perform validation when the value is truthy
        // Consumers rely on required() to enforce required fields
        // All other validators succeed with no value to allow optional fields
        const isValid = !value || validate(value, Object.assign({}, props));
        return new ValidationResult(isValid, props);
    };
}
