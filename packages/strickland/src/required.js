import {parseString} from './string';

let notDefined;

export default function required(validatorProps) {
    return function validateRequired(value, validationProps) {
        const mergedProps = {
            ...validatorProps,
            ...validationProps
        };

        let isValid = true;

        const parse = typeof mergedProps.parseValue === 'function' ?
            mergedProps.parseValue : parseString;

        const parsedValue = parse(value, mergedProps);

        if (parsedValue === null || parsedValue === notDefined) {
            isValid = false;
        } else if (typeof parsedValue === 'string') {
            isValid = !!parsedValue.length;
        } else if (typeof parsedValue === 'boolean') {
            isValid = parsedValue;
        }

        return {
            ...mergedProps,
            value,
            parsedValue,
            isValid
        };
    }
}
