import {every, minLength, maxLength} from './strickland';

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
