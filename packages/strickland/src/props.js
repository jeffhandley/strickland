import validate from './validate';

export default function props(validators, validatorProps) {
    return function validateEach(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        const validateProps = {
            ...validationProps,
            resolvePromise: false
        };

        let result = {props: {}};

        if (value && validators && typeof validators === 'object') {
            result = Object.keys(validators).map((propName) =>
                convertToPropResult(
                    propName,
                    validate(validators[propName], value[propName], validateProps)
                )
            ).reduce(applyNextResult, result);
        }

        return prepareResult(value, validationProps, result);
    }
}

function convertToPropResult(propName, validationResult) {
    return {
        [propName]: validationResult
    };
}

function applyNextResult(previousResult, nextResult) {
    return {
        ...previousResult,
        props: {
            ...previousResult.props,
            ...nextResult
        }
    };
}

function prepareResult(value, validationProps, result) {
    const propNames = Object.keys(result.props);

    if (propNames.some((propName) => result.props[propName].resolvePromise instanceof Promise)) {
        let finalResult = {props: {}};

        const promiseResults = propNames.map((propName) =>
            result.props[propName].resolvePromise instanceof Promise ?
                result.props[propName].resolvePromise.then((resolvedResult) =>
                    convertToPropResult(propName, resolvedResult)
                ) :
                convertToPropResult(propName, result.props[propName])
        );

        result.resolvePromise = Promise.all(promiseResults).then((resolvedResults) =>
            resolvedResults.reduce(applyNextResult, finalResult)
        ).then((resolvedResult) => prepareResult(value, validationProps, resolvedResult));

    }

    return {
        ...validationProps,
        ...result,
        value,
        isValid: propNames.every((propName) => result.props[propName].isValid)
    };
}
