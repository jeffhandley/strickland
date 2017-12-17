import {isValid} from './strickland';
import minLength from './minLength';
import maxLength from './maxLength';

export default function range(minLengthValue, maxLengthValue, props) {
    if (typeof minLengthValue === 'object') {
        props = minLengthValue;
    } else if (typeof maxLengthValue === 'object') {
        props = {
            minLength: minLengthValue,
            ...maxLengthValue
        };
    } else {
        props = {
            minLength: minLengthValue,
            maxLength: maxLengthValue,
            ...props
        };
    };

    const validateMin = minLength(props);
    const validateMax = maxLength(props);

    return function validate(value) {
        let result = validateMin(value);

        if (isValid(result)) {
            result = {
                ...result,
                ...validateMax(value)
            };
        }

        return {
            ...props,
            ...result,
            value
        };
    }
}
