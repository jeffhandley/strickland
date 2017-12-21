import {isFalsyButNotZero} from './number';

export default function min(minProp, validatorProps) {
    if (typeof minProp === 'object') {
        validatorProps = minProp;

    } else {
        validatorProps = {
            min: minProp,
            ...validatorProps
        };
    }

    return function validateMin(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let minValue = validationProps.min;

        if (typeof minValue === 'function') {
            minValue = minValue();
        }

        if (typeof minValue !== 'number') {
            throw 'min must be a number';
        }

        let isValid = true;

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value < validationProps.min) {
            isValid = false;
        }

        return {
            ...validationProps,
            min: minValue,
            value,
            isValid
        };
    }
}
