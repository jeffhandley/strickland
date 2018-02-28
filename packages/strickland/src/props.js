import validate from './validate';
import {getValidatorProps} from './utils';

const initialResult = {
    isValid: true,
    props: {}
};

export default function props(validators, ...params) {
    return function validateProps(value, context) {
        const validatorProps = getValidatorProps(
            {value},
            [],
            params,
            context
        );

        if (!validators || !Object.keys(validators).length) {
            return {
                ...validatorProps,
                ...initialResult
            };
        }

        let hasPromises = false;
        let result = initialResult;

        if (value && validators && typeof validators === 'object') {
            result = Object.keys(validators).map((propName) => {
                const childContext = {
                    ...context,
                    ...((context && context.props && context.props[propName]) || {})
                };

                const validatorResult = validate(validators[propName], value[propName], childContext);
                hasPromises = hasPromises || validatorResult.validateAsync instanceof Promise;

                return {
                    isValid: validatorResult.isValid,
                    props: {
                        [propName]: validatorResult
                    }
                };
            }).reduce(applyNextResult, initialResult);

            const propNames = Object.keys(result.props);

            if (hasPromises) {
                const promiseResults = propNames.map((propName) =>
                    result.props[propName].validateAsync instanceof Promise ?
                        result.props[propName].validateAsync.then((resolvedResult) => (
                            {
                                isValid: resolvedResult.isValid,
                                props: {
                                    [propName]: resolvedResult
                                }
                            }
                        )) :
                        {
                            isValid: result.props[propName].isValid,
                            props: {
                                [propName]: result.props[propName]
                            }
                        }
                );

                result.validateAsync = Promise.all(promiseResults).then((resolvedResults) => {
                    const finalResult = resolvedResults.reduce(applyNextResult, initialResult);

                    return {
                        ...validatorProps,
                        ...finalResult
                    };
                });

            }
        }

        return {
            ...validatorProps,
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
