import ValidationResult from './ValidationResult';
import required from './required';
import { isValid } from './validation';
import { isFunction } from 'lodash';

const requiredValidator = required();

export function isIgnored(value) {
    // If a value doesn't pass the required validator, then it is ignored
    // The required validator is the only one that fails for empty values
    return !isValid(value, [ requiredValidator ]);
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
    props = Object.assign(
        {
            validator,
            message: 'Invalid',
            isIgnored
        },
        props
    );

    return (value) => {
        // Create a fresh props object for the result
        const resultProps = Object.assign({ }, props);

        // See if the value should be ignored
        resultProps.isIgnored = isIgnoredWrapper(props.isIgnored, value);

        const resultIsValid = resultProps.isIgnored || validate(value, resultProps);
        return new ValidationResult(resultIsValid, resultProps);
    };
}
