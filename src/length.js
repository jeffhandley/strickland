import validator from './validator';
import { lte, gte } from 'lodash';

export default function length(min = 0, max = 0, props) {
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
        (value) => gte(value.length, min) && lte(value.length, max),
        props
    );
}
