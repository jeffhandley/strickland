import validate from './validate';
import minValidator from './min';
import maxValidator from './max';

export default function rangeValidator(validatorProps) {
    return function validateRange(value, context) {
        const props = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        const {min, max} = props;

        const result = validate([
            minValidator({min}),
            maxValidator({max})
        ], value, context);

        return {
            ...props,
            ...result
        };
    }
}
