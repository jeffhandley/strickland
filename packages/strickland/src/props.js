import validate from './strickland';

export default function props(propRules, validatorProps) {
    return function validateProps(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        function executeValidators(currentResult, validators) {
            if (!value || typeof value !== 'object' || !validators) {
                return currentResult;
            }

            const propNames = Object.keys(validators);

            let propResults = {};
            let allValid = true;

            propNames.forEach((propName) => {
                const propResult = validate(validators[propName], value[propName], validationProps);
                allValid = allValid && propResult.isValid;

                propResults = {
                    ...propResults,
                    [propName]: propResult
                }
            });

            return {
                ...currentResult,
                props: propResults,
                isValid: allValid
            };
        }

        let initialResult = {
            props: {},
            isValid: true
        };

        const result = executeValidators(initialResult, propRules)
        return prepareResult(validationProps, result);
    }
}

function prepareResult(validationProps, result) {
    return {
        ...validationProps,
        ...result
    };
}
