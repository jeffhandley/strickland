import {isValid} from './strickland';
import minValue from './minValue';
import maxValue from './maxValue';

export default function range(rangeMin, rangeMax, props) {
    if (typeof rangeMin === 'object') {
        props = rangeMin;
    } else if (typeof rangeMax === 'object') {
        props = {
            minValue: rangeMin,
            ...rangeMax
        };
    } else {
        props = {
            minValue: rangeMin,
            maxValue: rangeMax,
            ...props
        };
    };

    const validateMin = minValue(props);
    const validateMax = maxValue(props);

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
