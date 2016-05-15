import ValidationResult from './ValidationResult';

export default function requiredValidator(props) {
    props = Object.assign({}, props);
    props.message = props.message || 'Required';

    // Since validator only performs validation for truthy values,
    // we do the evaluation directly and return a ValidationResult
    return (value) => {
        const isValid = !!value;
        return new ValidationResult(isValid, props);
    };
}
