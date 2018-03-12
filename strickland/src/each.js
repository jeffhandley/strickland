import validate from './validate';

const initialResult = {
    isValid: true,
    each: []
};

export default function eachValidator(validators, validatorProps) {
    if (!validators || !Array.isArray(validators)) {
        throw 'Strickland: The `each` validator expects an array of validators';
    }

    return function validateEach(value, context) {
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
                const promises = result.each.map(
                    (eachResult) => Promise.resolve(
                        eachResult.validateAsync ? eachResult.validateAsync() : eachResult
                    )
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

        return {
            ...props,
            ...result
        };
    }
}

function applyNextResult(previousResult, nextResult) {
    return {
        ...previousResult,
        ...nextResult,
        isValid: previousResult.isValid && nextResult.isValid,
        each: [
            ...previousResult.each,
            nextResult
        ]
    };
}
