import validate, {isValid} from './strickland';
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

    const validateRangeLength = [
        minLength(props),
        maxLength(props)
    ];

    return validate.bind(null, validateRangeLength);
}
