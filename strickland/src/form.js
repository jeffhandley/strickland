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

        let formFields = (context && context.form && context.form.fields) || validatorProps.fields;

        if (formFields && !Array.isArray(formFields)) {
            formFields = [formFields];
        }

        function shouldValidateField(fieldName) {
            return validators[fieldName] && (!formFields || formFields.indexOf(fieldName) !== -1);
        }

        const fieldValidators = Object.keys(validators)
            .filter(shouldValidateField)
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

        const existingResultFields = Object.keys(existingResults)
            .filter((fieldName) => !shouldValidateField(fieldName));

        const hasExistingAsyncResults = existingResultFields
            .some((fieldName) => existingResults[fieldName].validateAsync);

        if (hasExistingAsyncResults || result.validateAsync) {
            // ensure the captured result doesn't gain the validateAsync function
            const capturedResult = {...result};

            const resultValidateAsync = capturedResult.validateAsync || (() => capturedResult);

            result.validateAsync = function resolveAsync() {
                const existingResultPromises = existingResultFields
                    .map((fieldName) => Promise.resolve(
                        existingResults[fieldName].validateAsync ?
                            existingResults[fieldName].validateAsync() :
                            existingResults[fieldName]
                    ).then((eachResult) => ({
                        [fieldName]: eachResult
                    })));

                const resolveExistingResults = Promise.all(existingResultPromises).then(
                    (resolvedResults) => resolvedResults.reduce((previousResult, nextResult) => ({
                        ...previousResult,
                        ...nextResult
                    }), {})
                );

                const resultPromise = Promise.resolve(resultValidateAsync());

                return Promise.all([resultPromise, resolveExistingResults])
                    .then(([resolvedResult, resolvedExistingResults]) =>
                        prepareResult(validatorProps, resolvedResult, validators, resolvedExistingResults)
                    );
            }
        }

        return prepareResult(validatorProps, result, validators, existingResults);
    }
}

function prepareResult(validatorProps, result, validators, existingResults) {
    const {props: resultProps, ...otherProps} = result;

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

    const isComplete = !result.validateAsync &&
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
        }
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
