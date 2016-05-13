import ValidationResult from './ValidationResult';
import { isObject } from 'lodash';

export default function minvalue(min = 0, props = {}) {
    if (isObject(min)) {
        props = min;
        min = props.min;
    }

    props.message = props.message || `At least ${min}`;

    return (value) => {
        const isValid = !value || value >= min;
        return new ValidationResult(isValid, props);
    };
}
