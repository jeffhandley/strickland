import validate from './validate';

const initialResult = {
    isValid: true,
    props: {}
};

export default function propsValidator(validators, validatorProps) {
    if (typeof validators !== 'object' || Array.isArray(validators) || !validators) {
        throw 'Strickland: The `props` validator expects an object';
    }

    return function validateProps(value, context) {
        const props = (typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps) || {};

        if (!validators || !Object.keys(validators).length) {
            return {
                ...props,
                ...initialResult
            };
        }

        let hasAsyncResults = false;
        let result = initialResult;

        if (value && validators && typeof validators === 'object') {
            result = Object.keys(validators).map((propName) => {
                const childContext = {
                    ...context,
                    ...((context && context.props && context.props[propName]) || {})
                };

                const validatorResult = validate(validators[propName], value[propName], childContext);
                hasAsyncResults = hasAsyncResults || validatorResult.validateAsync;

                return {
                    isValid: validatorResult.isValid,
                    props: {
                        [propName]: validatorResult
                    }
                };
            }).reduce(applyNextResult, initialResult);

            const propNames = Object.keys(result.props);

            if (hasAsyncResults) {
                result.validateAsync = function resolveAsync() {
                    const promises = propNames.map(
                        (propName) => Promise.resolve(
                            result.props[propName].validateAsync ?
                                result.props[propName].validateAsync() :
                                result.props[propName]
                        ).then((eachResult) => ({
                            isValid: eachResult.isValid,
                            props: {
                                [propName]: eachResult
                            }
                        }))
                    );

                    return Promise.all(promises).then((results) => {
                        const resolvedResult = results.reduce(applyNextResult, initialResult);

                        return {
                            ...props,
                            ...resolvedResult
                        };
                    });
                }
            }
        }

        return {
            ...props,
            ...result
        };
    }
}

function applyNextResult(previousResult, nextResult) {
    return {
        isValid: previousResult.isValid && nextResult.isValid,
        props: {
            ...previousResult.props,
            ...nextResult.props
        }
    };
}
