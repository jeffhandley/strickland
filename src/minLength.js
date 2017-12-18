import validate from './strickland';
import {parseString} from './string';

export default function minLength(min, props) {
    if (typeof min === 'object') {
        props = min;
    } else {
        props = {
            minLength: min,
            ...props
        };
    };

    if (typeof props.minLength !== 'number') {
        throw 'minLength must be a number';
    }

    if (props.trim !== false && props.trim !== true) {
        props.trim = true;
    }

    function validateMinLength(value) {
        let isValid = true;
        let parse;

        if (typeof props.parseValue === 'function') {
            parse = props.parseValue;
        } else {
            parse = (value) => parseString(value, {trim: props.trim});
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
        } else if (length < props.minLength) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            parsedValue,
            length
        };
    }

    return validate.bind(null, validateMinLength);
}
