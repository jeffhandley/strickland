import validate from './strickland';
import min from './min';
import max from './max';

export default function range(minValue, maxValue, props) {
    if (typeof minValue === 'object') {
        props = minValue;
    } else if (typeof maxValue === 'object') {
        props = {
            min: minValue,
            ...maxValue
        };
    } else {
        props = {
            min: minValue,
            max: maxValue,
            ...props
        };
    }

    const validateRange = [
        min(props),
        max(props)
    ];

    return validate.bind(null, validateRange);
}
