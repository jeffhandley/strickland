import validate from './strickland';
import {parseString} from './string';

let notDefined;

export default function required(props) {
    let validateProps = {
        ...props
    };

    function validateRequired(value) {
        let isValid = true;

        const parse = typeof validateProps.parseValue === 'function' ?
            validateProps.parseValue : parseString;

        const parsedValue = parse(value);

        if (parsedValue === null || parsedValue === notDefined) {
            isValid = false;
        } else if (typeof parsedValue === 'string') {
            isValid = !!parsedValue.length;
        } else if (typeof parsedValue === 'boolean') {
            isValid = parsedValue;
        }

        return {
            ...validateProps,
            isValid,
            parsedValue
        };
    }

    return validate.bind(null, validateRequired);
}
