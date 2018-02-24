import {isFalsyButNotZero} from './number';

export default function compare(compareValue) {
    return function validateCompare(value) {
        let isValid = true;

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (value !== compareValue) {
            isValid = false;
        }

        return {
            compare: compareValue,
            isValid
        };
    }
}
