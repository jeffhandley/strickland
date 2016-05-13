import ValidationResult from './ValidationResult';
import { isObject } from 'lodash';

export default function minlength(min = 0, props = {}) {
    if (isObject(min)) {
        props = min;
        min = props.min;
    }

    props.message = props.message || `At least ${min} characters`;

    return (value) => {
        const isValid = !value || value.length >= min;
        return new ValidationResult(isValid, props);
    };
}
