import validator from './validator';
import { lte, gte } from 'lodash';

export default function lengthValidator(min = 0, max = min, props) {
    props = props || {};

    if (max < min) {
        max = min;
    }

    if (min === max) {
        props.message = props.message || `Length of ${min}`;
    } else {
        props.message = props.message || `Length between ${min} and ${max}`;
    }

    return validator(
        (value) => !value.length || (gte(value.length, min) && lte(value.length, max)),
        props
    );
}
