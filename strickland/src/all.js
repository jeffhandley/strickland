import validate from './validate';
import getMiddleware from './utils/middleware';

const initialResult = {
    isValid: true,
    all: []
};

export default function allValidator(validators, validatorProps) {
    if (!validators || !Array.isArray(validators)) {
        throw 'Strickland: The `all` validator expects an array of validators';
    }

    return function validateAll(value, validationContext) {
        const {context, reduceResults, prepareResult} = getMiddleware({
            value,
            validatorProps,
            validationContext,
            reduceResultsCore
        });

        let result = initialResult;
        let hasAsyncResults = false;

        validators.forEach((validator) => {
            const nextResult = validate(validator, value, context);
            hasAsyncResults = hasAsyncResults || nextResult.validateAsync;

            // guard against middleware failing to return a result
            result = reduceResults(result, nextResult) || {};
        });

        if (hasAsyncResults) {
            result.validateAsync = function resolveAsync() {
                const promises = result.all.map(
                    (eachResult) => Promise.resolve(
                        eachResult.validateAsync ? eachResult.validateAsync() : eachResult
                    )
                );

                return Promise.all(promises).then((results) => {
                    const resolvedResult = results.reduce(reduceResults, initialResult);

                    return prepareResult(resolvedResult);
                });
            };
        }

        return prepareResult(result);
    };
}

function reduceResultsCore(accumulator, currentResult) {
    // Be sure to guard against middleware failing to provide `isValid` and `all`
    return {
        ...accumulator,
        ...currentResult,
        isValid: !!accumulator.isValid && !!currentResult.isValid,
        all: [
            ...(accumulator.all || []),
            currentResult
        ]
    };
}
