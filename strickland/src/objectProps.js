import validate from './validate';
import getMiddleware from './utils/middleware';

const initialResult = {
    isValid: true,
    objectProps: {}
};

export default function objectPropsValidator(validators, validatorProps) {
    if (typeof validators !== 'object' || Array.isArray(validators) || !validators) {
        throw 'Strickland: The `objectProps` validator expects an object';
    }

    return function validateObjectProps(value, validationContext) {
        const {context, reduceResults, prepareResult} = getMiddleware({
            value,
            validatorProps,
            validationContext,
            reduceResultsCore
        });

        let hasAsyncResults = false;
        let result = initialResult;

        if (value && validators && typeof validators === 'object') {
            result = Object.keys(validators).map((propName) => {
                const childContext = {
                    ...context,
                    ...((context && context.objectProps && context.objectProps[propName]) || {})
                };

                const validatorResult = validate(validators[propName], value[propName], childContext);
                hasAsyncResults = hasAsyncResults || validatorResult.validateAsync;

                return {
                    isValid: validatorResult.isValid,
                    objectProps: {
                        [propName]: validatorResult
                    }
                };
            }).reduce(reduceResults, initialResult) || {};
            // guard against middleware failing to return a result

            // or omitting the `objectProps` result prop
            const propNames = Object.keys(result.objectProps || {});

            if (hasAsyncResults) {
                result.validateAsync = function resolveAsync() {
                    const promises = propNames.map(
                        (propName) => Promise.resolve(
                            result.objectProps[propName].validateAsync ?
                                result.objectProps[propName].validateAsync() :
                                result.objectProps[propName]
                        ).then((eachResult) => ({
                            isValid: eachResult.isValid,
                            objectProps: {
                                [propName]: eachResult
                            }
                        }))
                    );

                    return Promise.all(promises).then((results) => {
                        const resolvedResult = results.reduce(reduceResults, initialResult);

                        return prepareResult(resolvedResult);
                    });
                };
            }
        }

        return prepareResult(result);
    };
}

function reduceResultsCore(previousResult, nextResult) {
    return {
        isValid: previousResult.isValid && nextResult.isValid,
        objectProps: {
            ...previousResult.objectProps,
            ...nextResult.objectProps
        }
    };
}
