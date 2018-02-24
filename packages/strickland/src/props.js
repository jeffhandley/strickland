import validate from './validate';

const initialResult = {
    isValid: true,
    props: {}
};

export default function props(validators) {
    return function validateProps(value) {
        let hasPromises = false;
        let result = initialResult;

        if (value && validators && typeof validators === 'object') {
            result = Object.keys(validators).map((propName) => {
                const validatorResult = validate(validators[propName], value[propName]);
                hasPromises = hasPromises || validatorResult.validateAsync instanceof Promise;

                return convertToPropResult(propName, validatorResult)
            }).reduce(applyNextResult, result);

            const propNames = Object.keys(result.props);

            if (hasPromises) {
                const promiseResults = propNames.map((propName) =>
                    result.props[propName].validateAsync instanceof Promise ?
                        result.props[propName].validateAsync.then((resolvedResult) =>
                            convertToPropResult(propName, resolvedResult)
                        ) :
                        convertToPropResult(propName, result.props[propName])
                );

                result.validateAsync = Promise.all(promiseResults).then(
                    (resolvedResults) => resolvedResults.reduce(applyNextResult, initialResult)
                );

            }
        }

        return result;
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
        isValid: previousResult.isValid && nextResult.isValid,
        props: {
            ...previousResult.props,
            ...nextResult
        }
    };
}
