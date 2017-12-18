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
    };

    if (typeof props.compare === 'undefined') {
        throw 'compare value must be specified';
    }

    function validateCompare(value) {
        let isValid = true;

        const parse = typeof props.parseValue === 'function' ?
            props.parseValue : parseString;

        const parsedValue = parse(value);
        const parsedCompare = parse(props.compare);

        if (!parsedValue) {
            // Empty values are always valid except with the required validator
        } else if (parsedValue !== parsedCompare) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            parsedValue,
            parsedCompare
        };
    }

    return validate.bind(null, validateCompare);
}
