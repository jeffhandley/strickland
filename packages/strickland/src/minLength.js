import validate from './strickland';
import {parseString} from './string';

export default function minLength(min, props) {
    let validatorProps;

    if (typeof min === 'object') {
        validatorProps = {
            ...min
        };
    } else {
        validatorProps = {
            minLength: min,
            ...props
        };
    }

    if (typeof validatorProps.minLength !== 'number') {
        throw 'minLength must be a number';
    }

    if (validatorProps.trim !== false && validatorProps.trim !== true) {
        validatorProps.trim = true;
    }

    function validateMinLength(value, validateProps) {
        const mergedProps = {
            ...validatorProps,
            ...validateProps
        };

        let isValid = true;
        let parse;

        if (typeof mergedProps.parseValue === 'function') {
            parse = mergedProps.parseValue;
        } else {
            parse = (toParse) => parseString(toParse, {trim: mergedProps.trim});
        }

        const parsedValue = parse(value);
        let length;

        if (typeof parsedValue === 'string') {
            length = parsedValue.length;
        }

        if (!parsedValue) {
            // Empty values are always valid except with the required validator
        } else if (typeof parsedValue !== 'string') {
            isValid = false;
        } else if (length < mergedProps.minLength) {
            isValid = false;
        }

        return {
            ...mergedProps,
            isValid,
            parsedValue,
            length
        };
    }

    return validate.bind(null, validateMinLength);
}
