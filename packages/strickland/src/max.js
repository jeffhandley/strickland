import {isFalsyButNotZero, parseNumber} from './number';

export default function max(maxProp, validatorProps) {
    if (typeof maxProp === 'object') {
        validatorProps = {
            ...maxProp
        };
    } else {
        validatorProps = {
            max: maxProp,
            ...validatorProps
        };
    }

    if (typeof validatorProps.max !== 'number') {
        throw 'max must be a number';
    }

    return function validateMax(value, validationProps) {
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
        } else if (parsedValue > mergedProps.max) {
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
