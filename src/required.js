import {parseString} from './string';

let notDefined;

export default function required(props) {
    props = props || {};

    return function validate(value) {
        let isValid = true;

        const parse = typeof props.parseValue === 'function' ?
            props.parseValue : parseString;

        const parsedValue = parse(value);

        if (parsedValue === null || parsedValue === notDefined) {
            isValid = false;
        } else if (typeof parsedValue === 'string') {
            isValid = !!parsedValue.length;
        } else if (typeof parsedValue === 'boolean') {
            isValid = parsedValue;
        }

        return {
            ...props,
            isValid,
            value,
            parsedValue
        };
    }
}
