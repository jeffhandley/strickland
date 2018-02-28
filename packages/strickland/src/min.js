import {isFalsyButNotZero, getValidatorProps} from './utils';

export default function min(...params) {
    return function validateMin(value, context) {
        let isValid = true;

        const props = getValidatorProps(
            {value},
            ['min'],
            params,
            context
        );

        if (typeof props.min !== 'number') {
            throw 'min must be a number';
        }

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value < props.min) {
            isValid = false;
        }

        return {
            ...props,
            value,
            isValid
        };
    }
}
