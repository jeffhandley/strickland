import validate from './strickland';

export default function every(validators, validatorProps) {
    return function validateEvery(value, validationProps) {
        let mergedProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {
            ...mergedProps,
            value,
            every: [],
            isValid: true
        };

        validators.every((validator) => {
            let validatorResult = validate(validator, value, mergedProps);

            result = {
                ...result,
                ...validatorResult,
                every: [
                    ...result.every,
                    validatorResult
                ],
                isValid: validatorResult.isValid
            };

            return result.isValid;
        });

        return result;
    }
}
