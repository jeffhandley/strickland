import validator from './validator';
import { gte } from 'lodash';

export default function minFieldValueValidator(field, min = 0, props) {
    // field and max cannot be overridden; other props can
    props = Object.assign(
        {
            validator: minFieldValueValidator,
            fieldName: field
        },
        props,
        {
            field,
            min
        }
    );

    props.message = props.message || `${props.fieldName} must be no less than ${min}`;

    return validator(
        (value) => gte(value[field], min),
        props
    );
}
