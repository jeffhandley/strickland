import {isFalsyButNotZero, parseNumber} from './number';

export default function min(minValue, props) {
    if (typeof minValue === 'object') {
        props = minValue;
    } else {
        props = {
            min: minValue,
            ...props
        };
    };

    if (typeof props.min !== 'number') {
        throw 'min must be a number';
    }

    return function validate(value) {
        let isValid = true;

        const parse = typeof props.parseValue === 'function' ?
            props.parseValue : parseNumber;

        const parsedValue = parse(value);

        if (isFalsyButNotZero(parsedValue)) {
            // Empty values are always valid except with the required validator
        } else if (typeof parsedValue !== 'number') {
            isValid = false;
        } else if (parsedValue < props.min) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            value
        };
    }
}
