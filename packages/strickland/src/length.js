import every from './every';
import minLength from './minLength';
import maxLength from './maxLength';

export default function length(minLengthParam, maxLengthParam, validatorContext) {
    if (typeof minLengthParam === 'object') {
        validatorContext = minLengthParam;

    } else if (typeof maxLengthParam === 'object') {
        validatorContext = {
            minLength: minLengthParam,
            ...maxLengthParam
        };

    } else {
        validatorContext = {
            minLength: minLengthParam,
            maxLength: maxLengthParam,
            ...validatorContext
        };
    }

    return every([
        minLength(validatorContext),
        maxLength(validatorContext)
    ]);
}
