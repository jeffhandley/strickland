import {parseString} from './string';

export default function minLength(minLengthProp, validatorProps) {
    if (typeof minLengthProp === 'object') {
        validatorProps = {
            ...minLengthProp
        };
    } else {
        validatorProps = {
            minLength: minLengthProp,
            ...validatorProps
        };
    }

    if (typeof validatorProps.minLength !== 'number') {
        throw 'minLength must be a number';
    }

    if (validatorProps.trim !== false && validatorProps.trim !== true) {
        validatorProps.trim = true;
    }

    return function validateMinLength(value, validationProps) {
        const mergedProps = {
            ...validatorProps,
            ...validationProps
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
        } else if (length < mergedProps.minLength) {
            isValid = false;
        }

        return {
            ...mergedProps,
            value,
            parsedValue,
            length,
            isValid
        };
    }
}
