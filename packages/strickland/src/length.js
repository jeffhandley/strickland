import validate from './validate';
import minLength from './minLength';
import maxLength from './maxLength';
import {prepareProps} from './utils';

export default function length(...params) {
    return function validateLength(value, context) {
        const props = prepareProps(
            {value},
            ['minLength', 'maxLength'],
            params,
            context
        );

        const result = validate([
            minLength(props.minLength),
            maxLength(props.maxLength)
        ], value, context);

        return {
            ...props,
            ...result
        };
    }
}
