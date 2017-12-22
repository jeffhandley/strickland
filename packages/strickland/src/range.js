import {every, min, max} from './strickland';

export default function range(minProp, maxProp, validatorProps) {
    if (typeof minProp === 'object') {
        validatorProps = minProp;

    } else if (typeof maxProp === 'object') {
        validatorProps = {
            min: minProp,
            ...maxProp
        };

    } else {
        validatorProps = {
            min: minProp,
            max: maxProp,
            ...validatorProps
        };
    }

    return every([
        min(validatorProps),
        max(validatorProps)
    ]);

    return validate.bind(null, validateRange);
}
