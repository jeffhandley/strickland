import validator, { isIgnored } from './validator';
import { gte } from 'lodash';

export default function minFieldValueValidator(field, max = 0, props) {
    props = Object.assign({}, props);
    props.message = props.message || `${field} no less than ${max}`;

    props.isIgnored = (value) => {
        return isIgnored(value) || isIgnored(value[field]);
    };

    return validator(
        (value) => gte(value[field], max),
        props
    );
}
