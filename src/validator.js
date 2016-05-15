import ValidationResult from './ValidationResult';
import { isFunction } from 'lodash';

export default function validator(validate, props) {
    props = props || {};
    props.message = props.message || 'Invalid';

    let isIgnored;

    if (isFunction(isIgnored)) {
        // Ensure a Boolean is returned
        isIgnored = (value) => !!isIgnored(value);
    } else if (isIgnored) {
        // Ensure a Boolean is returned
        isIgnored = () => !!isIgnored;
    } else {
        isIgnored = (value) => {
            // Only perform validation when the value is truthy
            // Consumers rely on required() to enforce required fields
            // All other validators succeed with no value to allow optional fields
            return !value
        }
    }

    return (value) => {
        // Create a fresh props object for the result
        const resultProps = Object.assign({ }, props);

        // See if the value should be ignored
        resultProps.isIgnored = isIgnored(value);

        const isValid = resultProps.isIgnored || validate(value, resultProps);
        return new ValidationResult(isValid, resultProps);
    };
}
