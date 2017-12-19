import validate from './strickland';
import {isFalsyButNotZero, parseNumber} from './number';

export default function min(minValue, props) {
    let validatorProps;

    if (typeof minValue === 'object') {
        validatorProps = {
            ...minValue
        };
    } else {
        validatorProps = {
            min: minValue,
            ...props
        };
    }

    if (typeof validatorProps.min !== 'number') {
        throw 'min must be a number';
    }

    function validateMin(value, validateProps) {
        const mergedProps = {
            ...validatorProps,
            ...validateProps
        };

        let isValid = true;

        const parse = typeof mergedProps.parseValue === 'function' ?
            mergedProps.parseValue : parseNumber;

        const parsedValue = parse(value, mergedProps);

        if (isFalsyButNotZero(parsedValue)) {
            // Empty values are always valid except with the required validator
        } else if (typeof parsedValue !== 'number') {
            isValid = false;
        } else if (parsedValue < mergedProps.min) {
            isValid = false;
        }

        return {
            ...mergedProps,
            isValid,
            parsedValue
        };
    }

    return validate.bind(null, validateMin);
}
