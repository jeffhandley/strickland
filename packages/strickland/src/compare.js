import {isFalsyButNotZero} from './number';
import prepareProps from './prepareProps';

export default function compare(compareParam, validatorProps) {
    return function validateCompare(value, context) {
        let isValid = true;
        let props = prepareProps(['compare'], [compareParam, validatorProps], value, context);

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (value !== props.compare) {
            isValid = false;
        }

        return {
            ...props,
            isValid
        };
    }
}
