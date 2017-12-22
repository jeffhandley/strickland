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
                const propResult = validate(validators[propName], value[propName], validationProps);
                currentResult = applyPropResult(currentResult, propName, propResult);
            });

            return currentResult;
        }

        let initialResult = {
            props: {}
        };

        const result = executeValidators(initialResult, propRules)
        return prepareResult(value, validationProps, result);
    }
}

function applyPropResult(topLevelResult, propName, propResult) {
    return {
        ...topLevelResult,
        props: {
            ...topLevelResult.props,
            [propName]: propResult
        }
    };
}

function prepareResult(value, validationProps, result) {
    const propNames = Object.keys(result.props);
    const propPromises = [];
    let isValid = true;

    propNames.forEach((propName) => {
        const propResult = result.props[propName];

        if (propResult instanceof Promise) {
            propPromises.push(propResult.then((resolvedPropResult) => ({
                propName,
                resolvedPropResult
            })));
        } else {
            isValid = isValid && propResult.isValid;
        }
    });

    if (propPromises.length) {
        return Promise.all(propPromises).then((resolvedProps) => {
            resolvedProps.forEach(({propName, resolvedPropResult}) => {
                result = applyPropResult(result, propName, resolvedPropResult);
                isValid = isValid && resolvedPropResult.isValid;
            });

            return prepareResult(value, validationProps, result);
        });
    }

    return {
        ...validationProps,
        ...result,
        isValid
    };
}
