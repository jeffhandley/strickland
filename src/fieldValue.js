import validator, { isIgnored } from './validator';
import { lte, gte } from 'lodash';

export default function fieldValueValidator(field, min = 0, max = min, props) {
    props = Object.assign({}, props);

    if (lte(max, min)) {
        max = min;
    }

    if (min === max) {
        props.message = props.message || `${field} must be ${min}`;
    } else {
        props.message = props.message || `${field} must be between ${min} and ${max}`;
    }

    props.isIgnored = props.isIgnored || ((value) => {
        return isIgnored(value) || isIgnored(value[field]);
    });

    return validator(
        (value) => (gte(value[field], min) && lte(value[field], max)),
        props
    );
}
