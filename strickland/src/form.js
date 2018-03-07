import validate from './validate';
import {getValidatorProps} from './utils';

export default function form(validators, ...params) {
    if (typeof validators !== 'object' || Array.isArray(validators) || !validators) {
        throw 'Strickland: form expects an object';
    }

    return function validateForm(value, context) {
        const validatorProps = getValidatorProps(
            [],
            params,
            value,
            context
        );

        const fieldValidators = Object.keys(validators)
            .filter(shouldValidateField.bind(null, validators, validatorProps, context))
            .reduce((previousValidators, fieldName) => ({
                ...previousValidators,
                [fieldName]: validators[fieldName]
            }), {});

        const validationContext = {
            ...context,
            form: {
                ...((context && context.form) || {}),
                values: value
            }
        };

        const result = validate(fieldValidators, value, validationContext);
        const existingResults = (context && context.form && context.form.validationResults) || {};

        return prepareResult(validators, validatorProps, existingResults, result);
    }
}

function shouldValidateField(validators, validatorProps, context, fieldName) {
    const formFields = (
        context &&
        context.form &&
        context.form.fields
    ) || validatorProps.fields;

    return validators[fieldName] && (!formFields || formFields.indexOf(fieldName) !== -1);
}

function prepareResult(validators, validatorProps, existingResults, result) {
    let {props: resultProps, validateAsync, ...otherProps} = result;

    let validationResults = {
        ...existingResults,
        ...resultProps
    };

    const validationErrors = Object.keys(validationResults)
        .filter((fieldName) => !validationResults[fieldName].isValid)
        .filter((fieldName) => !validationResults[fieldName].validateAsync)
        .map((fieldName) => ({
            fieldName,
            ...validationResults[fieldName]
        }));

    const existingResultFields = Object.keys(existingResults)
        .filter((fieldName) => !resultProps[fieldName]);

    const hasExistingAsyncResults = existingResultFields
        .some((fieldName) => existingResults[fieldName].validateAsync);

    if (hasExistingAsyncResults || validateAsync) {
        const resultValidateAsync = validateAsync || (() => result);

        validateAsync = function resolveAsync(context) {
            function resolveFieldResult(fieldName) {
                const shouldResolve = existingResults[fieldName].validateAsync &&
                    shouldValidateField(validators, validatorProps, context, fieldName);

                const fieldPromise = shouldResolve ?
                    existingResults[fieldName].validateAsync() :
                    Promise.resolve(existingResults[fieldName]);

                return fieldPromise.then((fieldResult) => ({
                    [fieldName]: fieldResult
                }));
            }

            const existingResultPromises = existingResultFields.map(resolveFieldResult);

            const resolveExistingResults = Promise.all(existingResultPromises).then(
                (resolvedResults) => resolvedResults.reduce((previousResult, nextResult) => ({
                    ...previousResult,
                    ...nextResult
                }), {})
            );

            const resultPromise = Promise.resolve(resultValidateAsync());

            return Promise.all([resultPromise, resolveExistingResults])
                .then(([resolvedResult, resolvedExistingResults]) =>
                    prepareResult(validators, validatorProps, resolvedExistingResults, resolvedResult)
                );
        }
    }

    const isComplete = !validateAsync &&
        arraysEqual(Object.keys(validators).sort(), Object.keys(validationResults).sort());

    const isValid = isComplete &&
        result.isValid &&
        validationErrors.length === 0;

    const preparedResult = {
        ...validatorProps,
        ...otherProps,
        isValid,
        form: {
            isComplete,
            validationResults,
            validationErrors
        },
        ...(validateAsync ? {validateAsync} : {})
    };

    return preparedResult;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}
