import validator from './validator';
import { lte } from 'lodash';

export default function maxlength(max = 0, props = {}) {
    props.message = props.message || `Length no more than ${max}`;

    return validator(
        (value) => !value.length || lte(value.length, max),
        props
    );
}
