import validate from './validate';
import {getValidatorProps} from './utils';

const initialResult = {
    isValid: true,
    each: []
};

export default function each(validators, ...params) {
    return function validateEach(value, context) {
        let result = initialResult;
        let hasPromises = false;

        const validatorProps = getValidatorProps(
            {value},
            [],
            params,
            context
        );

        if (!validators || !validators.length) {
            return {
                ...validatorProps,
                ...initialResult
            };
        }

        validators.forEach((validator) => {
            const nextResult = validate(validator, value, context);
            hasPromises = hasPromises || nextResult.validateAsync instanceof Promise;

            result = applyNextResult(result, nextResult);
        });

        if (hasPromises) {
            const promises = result.each.map((eachResult) =>
                eachResult.validateAsync instanceof Promise ?
                    eachResult.validateAsync :
                    Promise.resolve(eachResult)
            );

            result.validateAsync = Promise.all(promises).then((results) => {
                const resolvedResult = results.reduce(applyNextResult, initialResult);

                return {
                    ...validatorProps,
                    ...resolvedResult
                };
            });
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
