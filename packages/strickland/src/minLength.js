import validate from './strickland';
import {parseString} from './string';

export default function minLength(min, props) {
    let validateProps;

    if (typeof min === 'object') {
        validateProps = {
            ...min
        };
    } else {
        validateProps = {
            minLength: min,
            ...props
        };
    }

    if (typeof validateProps.minLength !== 'number') {
        throw 'minLength must be a number';
    }

    if (validateProps.trim !== false && validateProps.trim !== true) {
        validateProps.trim = true;
    }

    function validateMinLength(value) {
        let isValid = true;
        let parse;

        if (typeof validateProps.parseValue === 'function') {
            parse = validateProps.parseValue;
        } else {
            parse = (toParse) => parseString(toParse, {trim: validateProps.trim});
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
        } else if (length < validateProps.minLength) {
            isValid = false;
        }

        return {
            ...validateProps,
            isValid,
            parsedValue,
            length
        };
    }

    return validate.bind(null, validateMinLength);
}
