import ValidationResult from './ValidationResult';

export default function required(props = {}) {
    props.message = props.message || 'Required';

    return (value) => {
        const isValid = !!value;
        return new ValidationResult(isValid, props);
    };
}
