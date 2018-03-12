import {isFalsyButNotZero} from './utils';

export default function compareValidator(validatorProps) {
    return function validateCompare(value, context) {
        const props = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        const {compare} = props || {};

        if (typeof compare === 'undefined') {
            throw 'Strickland: The `compare` validator requires a `compare` property';
        }

        let isValid = true;

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (value !== compare) {
            isValid = false;
        }

        return {
            ...props,
            isValid,
            compare
        };
    }
}
