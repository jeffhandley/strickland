import every from './every';
import min from './min';
import max from './max';

export default function range(minParam, maxParam, validatorProps) {
    if (typeof minParam === 'object') {
        validatorProps = minParam;

    } else if (typeof maxParam === 'object') {
        validatorProps = {
            min: minParam,
            ...maxParam
        };

    } else {
        validatorProps = {
            min: minParam,
            max: maxParam,
            ...validatorProps
        };
    }

    return every([
        min(validatorProps),
        max(validatorProps)
    ]);
}
