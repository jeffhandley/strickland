import {parseString} from './string';

export default function maxLength(max, props) {
    if (typeof max === 'object') {
        props = max;
    } else {
        props = {
            maxLength: max,
            ...props
        };
    };

    if (typeof props.maxLength !== 'number') {
        throw 'maxLength must be a number';
    }

    return function validate(value) {
        let isValid = true;

        const parse = typeof props.parseValue === 'function' ?
            props.parseValue : parseString;

        const parsedValue = parse(value);

        if (!parsedValue) {
            // Empty values are always valid except with the required validator
        } else if (typeof parsedValue !== 'string') {
            isValid = false;
        } else if (parsedValue.length > props.maxLength) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            value
        };
    }
}
