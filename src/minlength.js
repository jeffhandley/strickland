import validator from './validator';
import { gte } from 'lodash';

export default function minlength(min = 0, props = {}) {
    props.message = props.message || `At least ${min} characters`;

    return validator(
        (value) => gte(value.length, min),
        props
    );
}
