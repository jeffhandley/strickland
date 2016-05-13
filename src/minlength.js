import ValidationResult from './ValidationResult';
import { isObject } from 'lodash';

export default function minlength(value, min = 0, props = {}) {
    if (isObject(min)) {
        props = min;
        min = props.min;
    }

    props.message = props.message || `At least ${min} characters`;

    const isValid = !value || value.length >= min;
    return new ValidationResult(isValid, props);
}
