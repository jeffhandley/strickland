import ValidationResult from './ValidationResult';
import { isObject } from 'lodash';

export default function maxlength(value, max = 0, props = {}) {
    if (isObject(max)) {
        props = max;
        max = props.max;
    }

    props.message = props.message || `At most ${max} characters`;

    const isValid = !value || value.length <= max;
    return new ValidationResult(isValid, props);
}
