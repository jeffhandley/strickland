import validate from './strickland';
import {isFalsyButNotZero, parseNumber} from './number';

export default function max(maxValue, props) {
    let validatorProps;

    if (typeof maxValue === 'object') {
        validatorProps = {
            ...maxValue
        };
    } else {
        validatorProps = {
            max: maxValue,
            ...props
        };
    }

    if (typeof validatorProps.max !== 'number') {
        throw 'max must be a number';
    }

    function validateMax(value, validateProps) {
        const mergedProps = {
            ...validatorProps,
            ...validateProps
        };

        let isValid = true;

        const parse = typeof mergedProps.parseValue === 'function' ?
            mergedProps.parseValue : parseNumber;

        const parsedValue = parse(value);

        if (isFalsyButNotZero(parsedValue)) {
            // Empty values are always valid except with the required validator
        } else if (typeof parsedValue !== 'number') {
            isValid = false;
        } else if (parsedValue > mergedProps.max) {
            isValid = false;
        }

        return {
            ...mergedProps,
            isValid,
            parsedValue
        };
    }

    return validate.bind(null, validateMax);
}