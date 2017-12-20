import {parseString} from './string';

export default function compare(compareProp, validatorProps) {
    if (typeof compareProp === 'object') {
        validatorProps = {
            ...compareProp
        };
    } else {
        validatorProps = {
            compare: compareProp,
            ...validatorProps
        };
    }

    if (typeof validatorProps.compare === 'undefined') {
        throw 'compare value must be specified';
    }

    return function validateCompare(value, validationProps) {
        const mergedProps = {
            ...validatorProps,
            ...validationProps
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
            value,
            parsedValue,
            compare: valueToCompare,
            parsedCompare,
            isValid
        };
    }
}
