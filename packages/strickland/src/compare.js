import {isFalsyButNotZero} from './number';

export default function compare(compareParam, validatorContext) {
    if (typeof compareParam === 'object') {
        validatorContext = compareParam;

    } else {
        validatorContext = {
            compare: compareParam,
            ...validatorContext
        };
    }

    return function validateCompare(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext,
            value
        };

        let isValid = true;
        let compareValue = validationContext.compare;

        if (typeof compareValue === 'function') {
            compareValue = compareValue(validationContext);
        }

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (value !== compareValue) {
            isValid = false;
        }

        return {
            ...validationContext,
            compare: compareValue,
            isValid
        };
    }
}
