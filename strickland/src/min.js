import {isFalsyButNotZero} from './utils';

export default function minValidator(validatorProps) {
    return function validateMin(value, context) {
        let isValid = true;

        let props = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        if (typeof props === 'number') {
            props = {
                min: props
            };
        }

        const {min} = props;

        if (typeof min !== 'number') {
            throw 'Strickland: The `min` validator requires a numeric `min` property';
        }

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value < min) {
            isValid = false;
        }

        return {
            ...props,
            isValid
        };
    }
}
