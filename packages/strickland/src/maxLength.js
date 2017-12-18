import validate from './strickland';
import {parseString} from './string';

export default function maxLength(max, props) {
    let validateProps;

    if (typeof max === 'object') {
        validateProps = {
            ...max
        };
    } else {
        validateProps = {
            maxLength: max,
            ...props
        };
    }

    if (typeof validateProps.maxLength !== 'number') {
        throw 'maxLength must be a number';
    }

    if (validateProps.trim !== false && validateProps.trim !== true) {
        validateProps.trim = true;
    }

    function validateMaxLength(value) {
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
        } else if (length > validateProps.maxLength) {
            isValid = false;
        }

        return {
            ...validateProps,
            isValid,
            parsedValue,
            length
        };
    }

    return validate.bind(null, validateMaxLength);
}
