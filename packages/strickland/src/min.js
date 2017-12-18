import validate from './strickland';
import {isFalsyButNotZero, parseNumber} from './number';

export default function min(minValue, props) {
    let validateProps;

    if (typeof minValue === 'object') {
        validateProps = {
            ...minValue
        };
    } else {
        validateProps = {
            min: minValue,
            ...props
        };
    }

    if (typeof validateProps.min !== 'number') {
        throw 'min must be a number';
    }

    function validateMin(value) {
        let isValid = true;

        const parse = typeof validateProps.parseValue === 'function' ?
            validateProps.parseValue : parseNumber;

        const parsedValue = parse(value);

        if (isFalsyButNotZero(parsedValue)) {
            // Empty values are always valid except with the required validator
        } else if (typeof parsedValue !== 'number') {
            isValid = false;
        } else if (parsedValue < validateProps.min) {
            isValid = false;
        }

        return {
            ...validateProps,
            isValid,
            parsedValue
        };
    }

    return validate.bind(null, validateMin);
}
