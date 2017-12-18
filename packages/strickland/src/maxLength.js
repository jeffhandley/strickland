import validate from './strickland';
import {parseString} from './string';

export default function maxLength(max, props) {
    if (typeof max === 'object') {
        props = max;
    } else {
        props = {
            maxLength: max,
            ...props
        };
    }

    if (typeof props.maxLength !== 'number') {
        throw 'maxLength must be a number';
    }

    if (props.trim !== false && props.trim !== true) {
        props.trim = true;
    }

    function validateMaxLength(value) {
        let isValid = true;
        let parse;

        if (typeof props.parseValue === 'function') {
            parse = props.parseValue;
        } else {
            parse = (toParse) => parseString(toParse, {trim: props.trim});
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
        } else if (length > props.maxLength) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            parsedValue,
            length
        };
    }

    return validate.bind(null, validateMaxLength);
}
