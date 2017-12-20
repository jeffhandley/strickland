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

    if (typeof validatorProps.min !== 'number') {
        throw 'min must be a number';
    }

    return function validateMin(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let isValid = true;

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (value < validationProps.min) {
            isValid = false;
        }

        return {
            ...validationProps,
            value,
            isValid
        };
    }
}
