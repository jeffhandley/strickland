import {isFalsyButNotZero, parseNumber} from './number';

export default function maxValue(props) {
    if (typeof props !== 'object') {
        props = {
            maxValue: props
        };
    }

    if (typeof props.maxValue !== 'number') {
        throw 'maxValue must be a number';
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
        } else if (parsedValue > props.maxValue) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            value
        };
    }
}
