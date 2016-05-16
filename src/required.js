import validator from './validator';
import { isArray, isObject, isDate, isEmpty, isEqual } from 'lodash';

const emptyDate = new Date(0);

export default function requiredValidator(props) {
    props = Object.assign({}, props);
    props.message = props.message || 'Required';

    // The required validator doesn't ignore any values by default
    props.isIgnored = props.isIgnored || (() => false);

    const isValid = (value) => {
        if (isArray(value)) {
            return !isEmpty(value);
        }

        if (isDate(value)) {
            return !isEqual(value, emptyDate);
        }

        if (isArray(value) || isObject(value)) {
            return !isEmpty(value);
        }

        return !!value;
    };

    return validator(isValid, props);
}
