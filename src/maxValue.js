import validator from './validator';
import { lte } from 'lodash';

export default function maxValueValidator(max = 0, props) {
    // max cannot be overridden; other props can
    props = Object.assign(
        {
            validator: maxValueValidator,
            message: `No more than ${max}`
        },
        props,
        {
            max
        }
    );

    return validator(
        (value) => lte(value, max),
        props
    );
}
