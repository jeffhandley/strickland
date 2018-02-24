import validate from './validate';

const initialResult = {
    isValid: true,
    each: []
};

export default function each(validators) {
    return function validateEach(value) {
        let result = initialResult;
        let hasPromises = false;

        if (Array.isArray(validators)) {
            validators.forEach((validator) => {
                const nextResult = validate(validator, value);
                hasPromises = hasPromises || nextResult.validateAsync instanceof Promise;

                result = applyNextResult(result, nextResult);
            });
        }

        if (hasPromises) {
            const promises = result.each.map((eachResult) =>
                eachResult.validateAsync instanceof Promise ?
                    eachResult.validateAsync :
                    Promise.resolve(eachResult)
            );

            result.validateAsync = Promise.all(promises).then(
                (results) => results.reduce(applyNextResult, initialResult)
            );
        }

        return result;
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
