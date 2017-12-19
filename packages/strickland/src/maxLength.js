import validate from './strickland';
import {parseString} from './string';

export default function maxLength(max, props) {
    let validatorProps;

    if (typeof max === 'object') {
        validatorProps = {
            ...max
        };
    } else {
        validatorProps = {
            maxLength: max,
            ...props
        };
    }

    if (typeof validatorProps.maxLength !== 'number') {
        throw 'maxLength must be a number';
    }

    if (validatorProps.trim !== false && validatorProps.trim !== true) {
        validatorProps.trim = true;
    }

    function validateMaxLength(value, validateProps) {
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

        const parsedValue = parse(value, mergedProps);
        let length;

        if (typeof parsedValue === 'string') {
            length = parsedValue.length;
        }

        if (!parsedValue) {
            // Empty values are always valid except with the required validator
        } else if (typeof parsedValue !== 'string') {
            isValid = false;
        } else if (length > mergedProps.maxLength) {
            isValid = false;
        }

        return {
            ...mergedProps,
            isValid,
            parsedValue,
            length
        };
    }

    return validate.bind(null, validateMaxLength);
}
