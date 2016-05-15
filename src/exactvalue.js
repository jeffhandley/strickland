import validator from './validator';
import { isEqual } from 'lodash';

export default function exactvalue(exact = 0, props = {}) {
    props.message = props.message || `Exactly ${exact}`;

    return validator(
        (value) => isEqual(value, exact),
        props
    );
}
