import validate from './validate';
import {getValidatorProps} from './utils';

const initialResult = {
    isValid: true,
    props: {}
};

export default function props(validators, ...params) {
    return function validateProps(value, context) {
        const validatorProps = getValidatorProps(
            [],
            params,
            value,
            context
        );

        if (!validators || !Object.keys(validators).length) {
            return {
                ...validatorProps,
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
                            ...validatorProps,
                            ...resolvedResult
                        };
                    });
                }
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
