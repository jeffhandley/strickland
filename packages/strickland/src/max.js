import {isFalsyButNotZero, getValidatorProps} from './utils';

export default function max(...params) {
    return function validateMax(value, context) {
        let isValid = true;

        const props = getValidatorProps(
            {value},
            ['max'],
            params,
            context
        );

        if (typeof props.max !== 'number') {
            throw 'max must be a number';
        }

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value > props.max) {
            isValid = false;
        }

        return {
            ...props,
            value,
            isValid
        };
    }
}
