import validator from './validator';
import { lte } from 'lodash';

export default function maxValueValidator(max = 0, props) {
    props = props || {};
    props.message = props.message || `No more than ${max}`;

    return validator(
        (value) => lte(value, max),
        props
    );
}
