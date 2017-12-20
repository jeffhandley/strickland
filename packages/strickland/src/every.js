import validate from './strickland';

export default function every(validators, validatorProps) {
    return function validateEvery(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {
            ...validationProps,
            value,
            every: [],
            isValid: true
        };

        validators.every((validator) => {
            let validatorResult = validate(validator, value, validationProps);

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
