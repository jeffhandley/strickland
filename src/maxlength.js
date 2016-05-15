import validator from './validator';
import { lte } from 'lodash';

export default function maxlength(max = 0, props = {}) {
    props.message = props.message || `At most ${max} characters`;

    return validator(
        (value) => lte(value.length, max),
        props
    );
}
