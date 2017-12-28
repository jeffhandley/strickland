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
            ...validationContext
        };

        let isValid = true;
        let valueToCompare = validationContext.compare;

        if (typeof valueToCompare === 'function') {
            valueToCompare = valueToCompare();
        }

        if (!value) {
            // Empty values are always valid except with the required validator
        } else if (value !== valueToCompare) {
            isValid = false;
        }

        return {
            ...validationContext,
            value,
            compare: valueToCompare,
            isValid
        };
    }
}
