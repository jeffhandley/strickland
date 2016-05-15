import validator from './validator';
import { lte } from 'lodash';

export default function maxValueValidator(max = 0, props) {
    props = props || {};
    props.message = props.message || `At most ${max}`;

    return validator(
        (value) => lte(value, max),
        props
    );
}
