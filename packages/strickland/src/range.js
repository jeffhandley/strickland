import every from './every';
import min from './min';
import max from './max';

export default function range(minParam, maxParam, validatorContext) {
    if (typeof minParam === 'object') {
        validatorContext = minParam;

    } else if (typeof maxParam === 'object') {
        validatorContext = {
            min: minParam,
            ...maxParam
        };

    } else {
        validatorContext = {
            min: minParam,
            max: maxParam,
            ...validatorContext
        };
    }

    return every([
        min(),
        max()
    ], validatorContext);
}
