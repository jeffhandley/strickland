import every from './every';
import minLength from './minLength';
import maxLength from './maxLength';

export default function length(minLengthProp, maxLengthProp, validatorProps) {
    if (typeof minLengthProp === 'object') {
        validatorProps = minLengthProp;

    } else if (typeof maxLengthProp === 'object') {
        validatorProps = {
            minLength: minLengthProp,
            ...maxLengthProp
        };

    } else {
        validatorProps = {
            minLength: minLengthProp,
            maxLength: maxLengthProp,
            ...validatorProps
        };
    }

    return every([
        minLength(validatorProps),
        maxLength(validatorProps)
    ]);
}
