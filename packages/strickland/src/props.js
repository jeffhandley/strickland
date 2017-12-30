import validate from './validate';

export default function props(validators, validatorContext) {
    return function validateEach(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext
        };

        const validateProps = {
            ...validationContext,
            async: false
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

        return prepareResult(value, validationContext, result);
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

function prepareResult(value, validationContext, result) {
    const propNames = Object.keys(result.props);

    if (propNames.some((propName) => result.props[propName].async instanceof Promise)) {
        let finalResult = {props: {}};

        const promiseResults = propNames.map((propName) =>
            result.props[propName].async instanceof Promise ?
                result.props[propName].async.then((resolvedResult) =>
                    convertToPropResult(propName, resolvedResult)
                ) :
                convertToPropResult(propName, result.props[propName])
        );

        result.async = Promise.all(promiseResults).then((resolvedResults) =>
            resolvedResults.reduce(applyNextResult, finalResult)
        ).then((resolvedResult) => prepareResult(value, validationContext, resolvedResult));

    }

    return {
        ...validationContext,
        ...result,
        value,
        isValid: propNames.every((propName) => result.props[propName].isValid)
    };
}
