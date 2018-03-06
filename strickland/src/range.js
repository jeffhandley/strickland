import validate from './validate';
import min from './min';
import max from './max';
import {getValidatorProps} from './utils';

export default function length(...params) {
    return function validateLength(value, context) {
        const props = getValidatorProps(
            ['min', 'max'],
            params,
            value,
            context
        );

        const result = validate([
            min(props.min),
            max(props.max)
        ], value, context);

        return {
            ...props,
            ...result
        };
    }
}
