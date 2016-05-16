import validator from './validator';
import { lte, gte } from 'lodash';

export default function fieldValueValidator(field, min = 0, max = min, props) {
    if (lte(max, min)) {
        max = min;
    }

    // field, min, and max cannot be overridden; other props can
    props = Object.assign(
        { validator: fieldValueValidator, fieldName: field },
        props,
        { field, min, max }
    );

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
