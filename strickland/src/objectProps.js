import validate from './validate';

const initialResult = {
    isValid: true,
    objectProps: {},
    validationResults: []
};

export default function objectPropsValidator(validators, validatorProps) {
    if (typeof validators !== 'object' || Array.isArray(validators) || !validators) {
        throw 'Strickland: The `objectProps` validator expects an object';
    }

    return function validateObjectProps(value, context) {
        const props = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        if (!validators || !Object.keys(validators).length) {
            return prepareResult(props, initialResult);
        }

        let hasAsyncResults = false;
        let result = initialResult;

        if (value && validators && typeof validators === 'object') {
            result = Object.keys(validators).map((fieldName) => {
                const childContext = {
                    ...context,
                    ...((context && context.objectProps && context.objectProps[fieldName]) || {})
                };

                const validatorResult = validate(validators[fieldName], value[fieldName], childContext);
                hasAsyncResults = hasAsyncResults || validatorResult.validateAsync;

                return {
                    isValid: validatorResult.isValid,
                    objectProps: {
                        [fieldName]: validatorResult
                    }
                };
            }).reduce(applyNextResult, initialResult);

            const fieldNames = Object.keys(result.objectProps);

            if (hasAsyncResults) {
                result.validateAsync = function resolveAsync() {
                    const promises = fieldNames.map(
                        (fieldName) => Promise.resolve(
                            result.objectProps[fieldName].validateAsync ?
                                result.objectProps[fieldName].validateAsync() :
                                result.objectProps[fieldName]
                        ).then((eachResult) => ({
                            isValid: eachResult.isValid,
                            objectProps: {
                                [fieldName]: eachResult
                            }
                        }))
                    );

                    return Promise.all(promises).then((results) => {
                        const resolvedResult = results.reduce(applyNextResult, initialResult);

                        return prepareResult(props, resolvedResult);
                    });
                };
            }
        }

        return prepareResult(props, result);
    };
}

function prepareResult(props, result) {
    const validationResults = Object.keys(result.objectProps)
        .map((fieldName) => {
            const {all, every, objectProps, ...aggregatedResultProps} = result.objectProps[fieldName];

            return {
                fieldName,
                ...aggregatedResultProps
            };
        });

    return {
        ...props,
        ...result,
        validationResults,
        validationErrors: validationResults.filter(({isValid}) => !isValid)
    };
}

function applyNextResult(previousResult, nextResult) {
    return {
        isValid: previousResult.isValid && nextResult.isValid,
        objectProps: {
            ...previousResult.objectProps,
            ...nextResult.objectProps
        }
    };
}
