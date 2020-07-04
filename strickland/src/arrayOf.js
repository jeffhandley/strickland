import validate from './validate';
import {isEmptyValue} from './utils';

const initialResult = {
    isValid: true,
    arrayOf: []
};

export default function arrayOfValidator(validator, validatorProps) {
    return function validateArray(valueArray, context) {
        const props = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        let hasAsyncResults = false;
        let result = initialResult;

        if (isEmptyValue(valueArray)) {
            // Empty values are always valid except with the required validator
        } else if (!Array.isArray(valueArray)) {
            result = {
                ...result,
                isValid: false
            };
        } else {
            result = valueArray.map((value, key) => {
                const childContext = {
                    ...context,
                    ...((context && context.arrayOf && context.arrayOf[key]) || ({}))
                };

                const validatorResult = validate(validator, value, childContext);
                hasAsyncResults = hasAsyncResults || validatorResult.validateAsync;

                return validatorResult;
            }).reduce(applyNextResult, initialResult);

            if (hasAsyncResults) {
                result.validateAsync = function resolveAsync() {
                    const promises = result.arrayOf.map(
                        (value, key) => Promise.resolve(
                            result.arrayOf[key].validateAsync ?
                                result.arrayOf[key].validateAsync() :
                                result.arrayOf[key]
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
        }

        return {
            ...props,
            ...result
        };
    };
}

function applyNextResult(previousResult, nextResult) {
    return {
        isValid: previousResult.isValid && nextResult.isValid,
        arrayOf: [
            ...previousResult.arrayOf,
            nextResult
        ]
    };
}
