import ValidationResult from './ValidationResult';
import { isEqual } from 'lodash';

export default function exactvalue(exact = 0, props = {}) {
    props.message = props.message || `Exactly ${exact}`;

    return (value) => {
        const isValid = !value || isEqual(value, exact);
        return new ValidationResult(isValid, props);
    };
}
