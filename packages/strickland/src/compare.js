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

    function validateCompare(value, validateProps) {
        const mergedProps = {
            ...validatorProps,
            ...validateProps
        };

        let isValid = true;
        let valueToCompare = mergedProps.compare;

        if (typeof valueToCompare === 'function') {
            valueToCompare = valueToCompare();
        }

        const parse = typeof mergedProps.parseValue === 'function' ?
            mergedProps.parseValue : parseString;

        const parsedValue = parse(value, mergedProps);
        const parsedCompare = parse(valueToCompare, mergedProps);

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
