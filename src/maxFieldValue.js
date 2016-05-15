import validator from './validator';
import { lte } from 'lodash';

export default function maxFieldValueValidator(field, max = 0, props) {
    props = props || {};
    props.message = props.message || `${field} no more than ${max}`;

    return validator(
        (value) => !value[field] || lte(value[field], max),
        props
    );
}
