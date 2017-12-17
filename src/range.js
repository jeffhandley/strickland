import validate, {isValid} from './strickland';
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
    };

    const validateMin = min(props);
    const validateMax = max(props);

    function validateRange(value) {
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
            isValid: isValid(result)
        };
    }

    return validate.bind(null, validateRange);
}
