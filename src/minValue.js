import validator from './validator';
import { gte } from 'lodash';

export default function minValueValidator(min = 0, props) {
    props = Object.assign(
        {
            validator: minValueValidator,
            message: `At least ${min}`
        },
        props,
        {
            min
        }
    );

    return validator(
        (value) => gte(value, min),
        props
    );
}
