export default function compare(compareProp, validatorProps) {
    if (typeof compareProp === 'object') {
        validatorProps = compareProp;

    } else {
        validatorProps = {
            compare: compareProp,
            ...validatorProps
        };
    }

    return function validateCompare(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let isValid = true;

        let valueToCompare = validationProps.compare;

        if (typeof valueToCompare === 'function') {
            valueToCompare = valueToCompare();
        }

        if (!value) {
            // Empty values are always valid except with the required validator
        } else if (value !== valueToCompare) {
            isValid = false;
        }

        return {
            ...validationProps,
            value,
            compare: valueToCompare,
            isValid
        };
    }
}
