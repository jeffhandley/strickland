import validate from './strickland';
import min from './min';
import max from './max';

export default function range(minValue, maxValue, props) {
    let validateProps;

    if (typeof minValue === 'object') {
        validateProps = {
            ...minValue
        };
    } else if (typeof maxValue === 'object') {
        validateProps = {
            min: minValue,
            ...maxValue
        };
    } else {
        validateProps = {
            min: minValue,
            max: maxValue,
            ...props
        };
    }

    const validateRange = [
        min(validateProps),
        max(validateProps)
    ];

    return validate.bind(null, validateRange);
}
