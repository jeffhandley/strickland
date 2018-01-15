import validate from './validate';

export default function props(validators, validatorContext) {
    return function validateEach(value, validationContext) {
        validationContext = {
            ...validatorContext,
            ...validationContext
        };

        let result = {props: {}};
        let hasPromises = false;

        if (value && validators && typeof validators === 'object') {
            result = Object.keys(validators).map((propName) => {
                const {props: propsContext = {}, ...otherContext} = validationContext;

                const childContext = {
                    ...otherContext,
                    ...propsContext[propName]
                };

                const validatorResult = validate(validators[propName], value[propName], childContext);
                hasPromises = hasPromises || validatorResult.validateAsync instanceof Promise;

                return convertToPropResult(propName, validatorResult)
            }).reduce(applyNextResult, result);
        }

        const propNames = Object.keys(result.props);

        if (hasPromises) {
            let finalResult = {props: {}};

            const promiseResults = propNames.map((propName) =>
                result.props[propName].validateAsync instanceof Promise ?
                    result.props[propName].validateAsync.then((resolvedResult) =>
                        convertToPropResult(propName, resolvedResult)
                    ) :
                    convertToPropResult(propName, result.props[propName])
            );

            result.validateAsync = Promise.all(promiseResults).then((resolvedResults) =>
                resolvedResults.reduce(applyNextResult, finalResult)
            ).then((resolvedResult) => prepareResult(value, validationContext, resolvedResult));

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

    return {
        ...validationContext,
        ...result,
        value,
        isValid: propNames.every((propName) => result.props[propName].isValid)
    };
}
