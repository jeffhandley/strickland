import {isFalsyButNotZero} from './number';

export default function min(minValue) {
    return function validateMin(value) {
        if (typeof minValue !== 'number') {
            throw 'min must be a number';
        }

        let isValid = true;

        if (isFalsyButNotZero(value)) {
            // Empty values are always valid except with the required validator

        } else if (typeof value !== 'number') {
            isValid = false;

        } else if (value < minValue) {
            isValid = false;
        }

        return {
            min: minValue,
            isValid
        };
    }
}
