import validate from './strickland';
import {parseString} from './string';

export default function compare(compareValue, props) {
    let validateProps;

    if (typeof compareValue === 'object') {
        validateProps = {
            ...compareValue
        };
    } else {
        validateProps = {
            compare: compareValue,
            ...props
        };
    }

    if (typeof validateProps.compare === 'undefined') {
        throw 'compare value must be specified';
    }

    if (validateProps.trim !== false && validateProps.trim !== true) {
        validateProps.trim = true;
    }

    function validateCompare(value) {
        let isValid = true;
        let parse;

        if (typeof validateProps.parseValue === 'function') {
            parse = validateProps.parseValue;
        } else {
            parse = (toParse) => parseString(toParse, {trim: validateProps.trim});
        }

        let valueToCompare = validateProps.compare;

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
            ...validateProps,
            isValid,
            compare: valueToCompare,
            parsedValue,
            parsedCompare
        };
    }

    return validate.bind(null, validateCompare);
}
