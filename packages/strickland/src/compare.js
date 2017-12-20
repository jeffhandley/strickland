export default function compare(compareProp, validatorProps) {
    if (typeof compareProp === 'object') {
        validatorProps = compareProp;

    } else {
        validatorProps = {
            compare: compareProp,
            ...validatorProps
        };
    }

    if (typeof validatorProps.compare === 'undefined') {
        throw 'compare value must be specified';
    }

    return function validateCompare(value, validationProps) {
        const mergedProps = {
            ...validatorProps,
            ...validationProps
        };

        let isValid = true;

        let valueToCompare = mergedProps.compare;

        if (typeof valueToCompare === 'function') {
            valueToCompare = valueToCompare();
        }

        if (!value) {
            // Empty values are always valid except with the required validator
        } else if (value !== valueToCompare) {
            isValid = false;
        }

        return {
            ...mergedProps,
            value,
            compare: valueToCompare,
            isValid
        };
    }
}
