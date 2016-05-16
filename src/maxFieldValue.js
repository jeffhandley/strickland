import validator from './validator';
import { lte } from 'lodash';

export default function maxFieldValueValidator(field, max = 0, props) {
    // field and max cannot be overridden; other props can
    props = Object.assign(
        {
            validator: maxFieldValueValidator,
            fieldName: field
        },
        props,
        {
            field,
            max
        }
    );

    props.message = props.message || `${props.fieldName} must be no more than ${max}`;

    return validator(
        (value) => lte(value[field], max),
        props
    );
}
