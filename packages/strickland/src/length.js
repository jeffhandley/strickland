import validate from './strickland';
import minLength from './minLength';
import maxLength from './maxLength';

export default function length(min, max, props) {
    let validatorProps;

    if (typeof min === 'object') {
        validatorProps = {
            ...min
        };
    } else if (typeof max === 'object') {
        validatorProps = {
            minLength: min,
            ...max
        };
    } else {
        validatorProps = {
            minLength: min,
            maxLength: max,
            ...props
        };
    }

    const validateRangeLength = [
        minLength(validatorProps),
        maxLength(validatorProps)
    ];

    return validate.bind(null, validateRangeLength);
}
