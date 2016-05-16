import validator, { isIgnored } from './validator';
import { lte } from 'lodash';

export default function maxFieldValueValidator(field, max = 0, props) {
    props = Object.assign({}, props);
    props.message = props.message || `${field} no more than ${max}`;

    props.isIgnored = props.isIgnored || ((value) => {
        return isIgnored(value) || isIgnored(value[field]);
    });

    return validator(
        (value) => lte(value[field], max),
        props
    );
}
