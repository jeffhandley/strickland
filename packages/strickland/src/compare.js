import validate from './strickland';
import {parseString} from './string';

export default function compare(compareValue, props) {
    if (typeof compareValue === 'object') {
        props = compareValue;
    } else {
        props = {
            compare: compareValue,
            ...props
        };
    }

    if (typeof props.compare === 'undefined') {
        throw 'compare value must be specified';
    }

    if (props.trim !== false && props.trim !== true) {
        props.trim = true;
    }

    function validateCompare(value) {
        let isValid = true;
        let parse;

        if (typeof props.parseValue === 'function') {
            parse = props.parseValue;
        } else {
            parse = (toParse) => parseString(toParse, {trim: props.trim});
        }

        let valueToCompare = props.compare;

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
            ...props,
            isValid,
            compare: valueToCompare,
            parsedValue,
            parsedCompare
        };
    }

    return validate.bind(null, validateCompare);
}
