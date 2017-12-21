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

    return function validateMax(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let maxValue = validationProps.max;

        if (typeof maxValue === 'function') {
            maxValue = maxValue();
        }

        if (typeof maxValue !== 'number') {
            throw 'max must be a number';
        }

        let isValid = true;

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value > validationProps.max) {
            isValid = false;
        }

        return {
            ...validationProps,
            max: maxValue,
            value,
            isValid
        };
    }
}
