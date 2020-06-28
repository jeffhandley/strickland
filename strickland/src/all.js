import validate from './validate';

const initialResult = {
    isValid: true,
    all: [],
    validationResults: []
};

export default function allValidator(validators, validatorProps) {
    if (!validators || !Array.isArray(validators)) {
        throw 'Strickland: The `all` validator expects an array of validators';
    }

    return function validateAll(value, context) {
        let result = initialResult;

        const props = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        let hasAsyncResults = false;
        validators.forEach((validator) => {
            const nextResult = validate(validator, value, context);
            hasAsyncResults = hasAsyncResults || nextResult.validateAsync;

            result = applyNextResult(result, nextResult);
        });

        if (hasAsyncResults) {
            result.validateAsync = function resolveAsync() {
                const promises = result.all.map(
                    (eachResult) => Promise.resolve(
                        eachResult.validateAsync ? eachResult.validateAsync() : eachResult
                    )
                );

                return Promise.all(promises).then((results) => {
                    const resolvedResult = results.reduce(applyNextResult, initialResult);

                    return prepareResult(props, resolvedResult);
                });
            };
        }

        return prepareResult(props, result);
    };
}

function prepareResult(props, result) {
    return {
        ...props,
        ...result,
        validationErrors: result.validationResults.filter((result) => !result.isValid)
    };
}

function applyNextResult(previousResult, nextResult) {
    const {all, every, objectProps, ...aggregatedResultProps} = nextResult;

    return {
        ...previousResult,
        ...nextResult,
        isValid: previousResult.isValid && nextResult.isValid,
        all: [
            ...previousResult.all,
            nextResult
        ],
        validationResults: [
            ...previousResult.validationResults,
            ...(Array.isArray(nextResult.validationResults) ?
                    nextResult.validationResults :
                    [aggregatedResultProps])
        ]
    };
}
