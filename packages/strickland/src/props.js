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

            propNames.forEach((propName) => {
                const previousResult = currentResult;
                const propResult = validate(validators[propName], value[propName], validationProps);

                currentResult = applyPropResult(previousResult, propName, propResult);
            });

            return currentResult;
        }

        let initialResult = {
            props: {},
            isValid: true
        };

        const result = executeValidators(initialResult, propRules)
        return prepareResult(validationProps, result);
    }
}

function applyPropResult(topLevelResult, propName, propResult) {
    return {
        ...topLevelResult,
        props: {
            ...topLevelResult.props,
            [propName]: propResult
        },
        isValid: !!(topLevelResult.isValid && propResult.isValid)
    };
}

function prepareResult(validationProps, result) {
    return {
        ...validationProps,
        ...result
    };
}
