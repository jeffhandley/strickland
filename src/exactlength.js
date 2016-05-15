import validator from './validator';
import { isEqual } from 'lodash';

export default function exactlength(length = 0, props = {}) {
    props.message = props.message || `Exactly ${length} characters`;

    return validator(
        (value) => isEqual(value.length, length),
        props
    );
}
