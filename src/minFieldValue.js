import validator from './validator';
import { gte } from 'lodash';

export default function minFieldValueValidator(field, min = 0, props) {
    props = Object.assign({}, props, { field, min });

    props.fieldName = props.fieldName || field;
    props.message = props.message || `${props.fieldName} must be no less than ${min}`;

    return validator(
        (value) => gte(value[field], min),
        props
    );
}
