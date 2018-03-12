import validate from './validate';
import minLengthValidator from './minLength';
import maxLengthValidator from './maxLength';

export default function lengthValidator(validatorProps) {
    return function validateLength(value, context) {
        let length = value ? value.length : 0;

        const props = (typeof validatorProps === 'function' ?
            validatorProps({...context, length}) :
            validatorProps) || {};

        const {minLength, maxLength} = props;

        const result = validate([
            minLengthValidator({minLength}),
            maxLengthValidator({maxLength})
        ], value, context);

        return {
            ...props,
            ...result,
            length
        };
    }
}
