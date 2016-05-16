import validator from './validator';
import { lte, gte } from 'lodash';

export default function fieldValueValidator(field, min = 0, max = min, props) {
    if (lte(max, min)) {
        max = min;
    }

    props = Object.assign({}, props, { field, min, max });
    props.fieldName = props.fieldName || field;

    if (min === max) {
        props.message = props.message || `${props.fieldName} must be ${min}`;
    } else {
        props.message = props.message || `${props.fieldName} must be between ${min} and ${max}`;
    }

    return validator(
        (value) => (gte(value[field], min) && lte(value[field], max)),
        props
    );
}
