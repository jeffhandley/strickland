import validator from './validator';
import { lte } from 'lodash';

export default function maxFieldValueValidator(field, max = 0, props) {
    props = Object.assign({}, props);
    props.message = props.message || `${field} no more than ${max}`;

    return validator(
        (value) => lte(value[field], max),
        props
    );
}
