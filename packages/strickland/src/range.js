import validate from './strickland';
import min from './min';
import max from './max';

export default function range(minValue, maxValue, props) {
    let validatorProps;

    if (typeof minValue === 'object') {
        validatorProps = {
            ...minValue
        };
    } else if (typeof maxValue === 'object') {
        validatorProps = {
            min: minValue,
            ...maxValue
        };
    } else {
        validatorProps = {
            min: minValue,
            max: maxValue,
            ...props
        };
    }

    const validateRange = [
        min(validatorProps),
        max(validatorProps)
    ];

    return validate.bind(null, validateRange);
}
