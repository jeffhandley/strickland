import {isFalsyButNotZero} from './number';

export default function max(maxValue) {
    return function validateMax(value) {
        if (typeof maxValue !== 'number') {
            throw 'max must be a number';
        }

        let isValid = true;

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value > maxValue) {
            isValid = false;
        }

        return {
            max: maxValue,
            isValid
        };
    }
}
