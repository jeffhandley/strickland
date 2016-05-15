import validator from './validator';
import { gte } from 'lodash';

export default function minFieldValueValidator(field, max = 0, props) {
    props = props || {};
    props.message = props.message || `${field} no less than ${max}`;

    return validator(
        (value) => !value[field] || gte(value[field], max),
        props
    );
}
