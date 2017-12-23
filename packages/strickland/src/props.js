import validate from './validate';

export default function props(propRules, validatorProps) {
    return function validateProps(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let propsResult = {};

        if (value && typeof value === 'object' && propRules) {
            const propNames = Object.keys(propRules);

            propsResult = propNames.reduce((previousResult, propName) => ({
                ...previousResult,
                [propName]: validate(propRules[propName], value[propName], validationProps)
            }), propsResult);
        }

        return prepareResult(value, validationProps, propsResult);
    }
}

function prepareResult(value, validationProps, propsResult) {
    const propNames = Object.keys(propsResult);
    const propPromises = [];
    let isValid = true;

    propNames.forEach((propName) => {
        const propResult = propsResult[propName];

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
            propsResult = resolvedProps.reduce((previousResult, {propName, resolvedPropResult}) => ({
                ...previousResult,
                [propName]: resolvedPropResult
            }), propsResult);

            return prepareResult(value, validationProps, propsResult);
        });
    }

    return {
        ...validationProps,
        props: propsResult,
        isValid
    };
}
