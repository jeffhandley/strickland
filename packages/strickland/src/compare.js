import {isFalsyButNotZero, getValidatorProps} from './utils';

export default function compare(...params) {
    return function validateCompare(value, context) {
        let isValid = true;

        const props = getValidatorProps(
            {value},
            ['compare'],
            params,
            context
        );

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (value !== props.compare) {
            isValid = false;
        }

        return {
            ...props,
            isValid
        };
    }
}
