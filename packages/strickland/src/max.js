import {isFalsyButNotZero} from './number';

export default function max(maxParam, validatorContext) {
    if (typeof maxParam === 'object') {
        validatorContext = maxParam;

    } else {
        validatorContext = {
            max: maxParam,
            ...validatorContext
        };
    }

    return function validateMax(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext,
            value
        };

        let maxValue = validationContext.max;

        if (typeof maxValue === 'function') {
            maxValue = maxValue(validationContext);
        }

        if (typeof maxValue !== 'number') {
            throw 'max must be a number';
        }

        let isValid = true;

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value > validationContext.max) {
            isValid = false;
        }

        return {
            ...validationContext,
            max: maxValue,
            isValid
        };
    }
}
