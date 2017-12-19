import validate from './strickland';
import {parseString} from './string';

export default function compare(compareValue, props) {
    let validatorProps;

    if (typeof compareValue === 'object') {
        validatorProps = {
            ...compareValue
        };
    } else {
        validatorProps = {
            compare: compareValue,
            ...props
        };
    }

    if (typeof validatorProps.compare === 'undefined') {
        throw 'compare value must be specified';
    }

    if (validatorProps.trim !== false && validatorProps.trim !== true) {
        validatorProps.trim = true;
    }

    function validateCompare(value, validateProps) {
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

        let valueToCompare = mergedProps.compare;

        if (typeof valueToCompare === 'function') {
            valueToCompare = valueToCompare();
        }

        const parsedValue = parse(value);
        const parsedCompare = parse(valueToCompare);

        if (!parsedValue) {
            // Empty values are always valid except with the required validator
        } else if (parsedValue !== parsedCompare) {
            isValid = false;
        }

        return {
            ...mergedProps,
            isValid,
            compare: valueToCompare,
            parsedValue,
            parsedCompare
        };
    }

    return validate.bind(null, validateCompare);
}
