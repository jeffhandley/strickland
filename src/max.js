import {isFalsyButNotZero, parseNumber} from './number';

export default function max(maxValue, props) {
    if (typeof maxValue === 'object') {
        props = maxValue;
    } else {
        props = {
            max: maxValue,
            ...props
        };
    };

    if (typeof props.max !== 'number') {
        throw 'max must be a number';
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
        } else if (parsedValue > props.max) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            value
        };
    }
}
