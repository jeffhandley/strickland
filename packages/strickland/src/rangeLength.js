import validate from './strickland';
import minLength from './minLength';
import maxLength from './maxLength';

export default function range(minLengthValue, maxLengthValue, props) {
    let validateProps;

    if (typeof minLengthValue === 'object') {
        validateProps = {
            ...minLengthValue
        };
    } else if (typeof maxLengthValue === 'object') {
        validateProps = {
            minLength: minLengthValue,
            ...maxLengthValue
        };
    } else {
        validateProps = {
            minLength: minLengthValue,
            maxLength: maxLengthValue,
            ...props
        };
    }

    const validateRangeLength = [
        minLength(validateProps),
        maxLength(validateProps)
    ];

    return validate.bind(null, validateRangeLength);
}
