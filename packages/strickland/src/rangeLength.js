import validate from './strickland';
import minLength from './minLength';
import maxLength from './maxLength';

export default function range(minLengthValue, maxLengthValue, props) {
    let validatorProps;

    if (typeof minLengthValue === 'object') {
        validatorProps = {
            ...minLengthValue
        };
    } else if (typeof maxLengthValue === 'object') {
        validatorProps = {
            minLength: minLengthValue,
            ...maxLengthValue
        };
    } else {
        validatorProps = {
            minLength: minLengthValue,
            maxLength: maxLengthValue,
            ...props
        };
    }

    const validateRangeLength = [
        minLength(validatorProps),
        maxLength(validatorProps)
    ];

    return validate.bind(null, validateRangeLength);
}
