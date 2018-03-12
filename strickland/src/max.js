import {isFalsyButNotZero} from './utils';

export default function maxValidator(validatorProps) {
    return function validateMax(value, context) {
        let isValid = true;

        let props = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        if (typeof props === 'number') {
            props = {
                max: props
            };
        }

        const {max} = props;

        if (typeof max !== 'number') {
            throw 'Strickland: The `max` validator requires a numeric `max` property';
        }

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value > max) {
            isValid = false;
        }

        return {
            ...props,
            isValid
        };
    }
}
