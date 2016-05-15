import validator from './validator';
import { gte } from 'lodash';

export default function minLengthValidator(max = 0, props) {
    props = props || {};
    props.message = props.message || `Length no less than ${max}`;

    return validator(
        (value) => !value.length || gte(value.length, max),
        props
    );
}
