import {prepareProps} from './utils';
let notDefined;

export default function required(...params) {
    return function validateRequired(value, context) {
        let isValid = true;

        const props = prepareProps(
            {value, required: true},
            ['required'],
            params,
            context
        );

        if (props.required) {
            if (value === null || value === notDefined) {
                isValid = false;

            } else if (typeof value === 'string') {
                isValid = !!value.length;

            } else if (typeof value === 'boolean') {
                isValid = value;
            }
        }

        return {
            ...props,
            isValid
        };
    }
}
