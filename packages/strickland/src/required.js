import validate from './strickland';
import {parseString} from './string';

let notDefined;

export default function required(props) {
    let validatorProps = {
        ...props
    };

    function validateRequired(value, validateProps) {
        const mergedProps = {
            ...validatorProps,
            ...validateProps
        };

        let isValid = true;

        const parse = typeof mergedProps.parseValue === 'function' ?
            mergedProps.parseValue : parseString;

        const parsedValue = parse(value);

        if (parsedValue === null || parsedValue === notDefined) {
            isValid = false;
        } else if (typeof parsedValue === 'string') {
            isValid = !!parsedValue.length;
        } else if (typeof parsedValue === 'boolean') {
            isValid = parsedValue;
        }

        return {
            ...mergedProps,
            isValid,
            parsedValue
        };
    }

    return validate.bind(null, validateRequired);
}
