import {prepareProps} from './utils';

export default function maxLength(...params) {
    return function validateMaxLength(value, context) {
        let isValid = true;
        let length = value ? value.length : 0;

        const props = prepareProps(
            {value, length},
            ['maxLength'],
            params,
            context
        );

        if (typeof props.maxLength !== 'number') {
            throw 'maxLength must be a number';
        }

        if (!value) {
            // Empty values are always valid except with the required validator

        } else if (length > props.maxLength) {
            isValid = false;
        }

        return {
            ...props,
            value,
            length,
            isValid
        };
    }
}
