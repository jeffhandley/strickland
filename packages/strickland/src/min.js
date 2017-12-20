import {isFalsyButNotZero, parseNumber} from './number';

export default function min(minProp, validatorProps) {
    if (typeof minProp === 'object') {
        validatorProps = {
            ...minProp
        };
    } else {
        validatorProps = {
            min: minProp,
            ...validatorProps
        };
    }

    if (typeof validatorProps.min !== 'number') {
        throw 'min must be a number';
    }

    return function validateMin(value, validationProps) {
        const mergedProps = {
            ...validatorProps,
            ...validationProps
        };

        let isValid = true;

        const parse = typeof mergedProps.parseValue === 'function' ?
            mergedProps.parseValue : parseNumber;

        const parsedValue = parse(value, mergedProps);

        if (isFalsyButNotZero(parsedValue)) {
            // Empty values are always valid except with the required validator
        } else if (typeof parsedValue !== 'number') {
            isValid = false;
        } else if (parsedValue < mergedProps.min) {
            isValid = false;
        }

        return {
            ...mergedProps,
            value,
            parsedValue,
            isValid
        };
    }
}
