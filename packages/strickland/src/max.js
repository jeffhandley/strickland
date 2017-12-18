import validate from './strickland';
import {isFalsyButNotZero, parseNumber} from './number';

export default function max(maxValue, props) {
    let validateProps;

    if (typeof maxValue === 'object') {
        validateProps = {
            ...maxValue
        };
    } else {
        validateProps = {
            max: maxValue,
            ...props
        };
    }

    if (typeof validateProps.max !== 'number') {
        throw 'max must be a number';
    }

    function validateMax(value) {
        let isValid = true;

        const parse = typeof validateProps.parseValue === 'function' ?
            validateProps.parseValue : parseNumber;

        const parsedValue = parse(value);

        if (isFalsyButNotZero(parsedValue)) {
            // Empty values are always valid except with the required validator
        } else if (typeof parsedValue !== 'number') {
            isValid = false;
        } else if (parsedValue > validateProps.max) {
            isValid = false;
        }

        return {
            ...validateProps,
            isValid,
            parsedValue
        };
    }

    return validate.bind(null, validateMax);
}
