import {isValid} from './strickland';
import min from './min';
import max from './max';

export default function range(rangeMin, rangeMax, props) {
    if (typeof rangeMin === 'object') {
        props = rangeMin;
    } else if (typeof rangeMax === 'object') {
        props = {
            min: rangeMin,
            ...rangeMax
        };
    } else {
        props = {
            min: rangeMin,
            max: rangeMax,
            ...props
        };
    };

    const validateMin = min(props);
    const validateMax = max(props);

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
