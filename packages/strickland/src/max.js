import {isFalsyButNotZero} from './number';

export default function max(maxProp, validatorProps) {
    if (typeof maxProp === 'object') {
        validatorProps = maxProp;

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

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator
        } else if (typeof value !== 'number') {
            isValid = false;
        } else if (value > mergedProps.max) {
            isValid = false;
        }

        return {
            ...mergedProps,
            value,
            isValid
        };
    }
}
