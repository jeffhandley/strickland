import {parseString} from './string';

export default function minLength(props) {
    if (typeof props !== 'object') {
        props = {
            minLength: props
        };
    }

    if (typeof props.minLength !== 'number') {
        throw 'minLength must be a number';
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
        } else if (parsedValue.length < props.minLength) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            value
        };
    }
}
