import ValidationResult from './ValidationResult';
import { isFunction } from 'lodash';

export function isIgnored(value) {
    // Only perform validation when the value is truthy
    // Consumers rely on required() to enforce required fields
    // All other validators succeed with no value to allow optional fields
    return !value
}

function isIgnoredWrapper(ignore, value) {
    // Ensure a Boolean is returned
    if (isFunction(ignore)) {
        return !!ignore(value);
    } else {
        return !!ignore;
    }
}

export default function validator(validate, props) {
    props = Object.assign({}, props);
    props.message = props.message || 'Invalid';
    props.isIgnored = props.isIgnored || isIgnored;

    return (value) => {
        // Create a fresh props object for the result
        const resultProps = Object.assign({ }, props);

        // See if the value should be ignored
        resultProps.isIgnored = isIgnoredWrapper(props.isIgnored, value);

        const isValid = resultProps.isIgnored || validate(value, resultProps);
        return new ValidationResult(isValid, resultProps);
    };
}
