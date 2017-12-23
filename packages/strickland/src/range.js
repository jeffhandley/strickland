import every from './every';
import min from './min';
import max from './max';

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
}
