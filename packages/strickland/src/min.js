import {isFalsyButNotZero} from './number';

export default function min(minParam, validatorContext) {
    if (typeof minParam === 'object') {
        validatorContext = minParam;

    } else {
        validatorContext = {
            min: minParam,
            ...validatorContext
        };
    }

    return function validateMin(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext,
            value
        };

        let minValue = validationContext.min;

        if (typeof minValue === 'function') {
            minValue = minValue(validationContext);
        }

        if (typeof minValue !== 'number') {
            throw 'min must be a number';
        }

        let isValid = true;

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value < validationContext.min) {
            isValid = false;
        }

        return {
            ...validationContext,
            value,
            min: minValue,
            isValid
        };
    }
}
