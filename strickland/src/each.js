import validate from './validate';
import {getValidatorProps} from './utils';

const initialResult = {
    isValid: true,
    each: []
};

export default function each(validators, ...params) {
    return function validateEach(value, context) {
        let result = initialResult;

        const validatorProps = getValidatorProps(
            [],
            params,
            value,
            context
        );

        if (!validators || !validators.length) {
            return {
                ...validatorProps,
                ...initialResult
            };
        }

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
                        ...validatorProps,
                        ...resolvedResult
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
        ...previousResult,
        ...nextResult,
        isValid: previousResult.isValid && nextResult.isValid,
        each: [
            ...previousResult.each,
            nextResult
        ]
    };
}
