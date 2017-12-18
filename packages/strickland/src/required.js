import validate from './strickland';
import {parseString} from './string';

let notDefined;

export default function required(props) {
    props = props || {};

    function validateRequired(value) {
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
            parsedValue
        };
    }

    return validate.bind(null, validateRequired);
}
