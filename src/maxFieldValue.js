import validator from './validator';
import { lte } from 'lodash';

export default function maxFieldValueValidator(field, max = 0, props) {
    props = Object.assign({}, props, { field, max });

    props.fieldName = props.fieldName || field;
    props.message = props.message || `${props.fieldName} must be no more than ${max}`;

    return validator(
        (value) => lte(value[field], max),
        props
    );
}
