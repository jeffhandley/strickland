import validate from './validate';
import {getValidatorProps} from './utils';

export default function form(validators, ...params) {
    if (typeof validators !== 'object' || Array.isArray(validators) || !validators) {
        throw 'Strickland: form expects an object';
    }

    return function validateForm(value, context) {
        const validatorProps = getValidatorProps(
            {value},
            [],
            params,
            context
        );

        const existingResults = context && context.form && context.form.validationResults;

        let formFields = (context && context.form && context.form.fields) || validatorProps.fields;

        if (formFields && !Array.isArray(formFields)) {
            formFields = [formFields];
        }

        function shouldValidateField(fieldName) {
            return validators[fieldName] && (!formFields || formFields.indexOf(fieldName) !== -1);
        }

        let fieldValidators = validators;

        if (formFields) {
            fieldValidators = {};

            Object.keys(validators).filter(shouldValidateField).forEach((fieldName) => {
                fieldValidators = {
                    ...fieldValidators,
                    [fieldName]: validators[fieldName]
                };
            });
        }

        const validationContext = {
            ...context,
            form: {
                ...((context && context.form) || {}),
                values: value
            }
        };

        const result = validate(fieldValidators, value, validationContext);

        let hasExistingPromises = false;
        let existingPromises;

        if (existingResults) {
            existingPromises = Object.keys(existingResults)
                .filter((fieldName) => !shouldValidateField(fieldName))
                .map((fieldName) => {
                    if (existingResults[fieldName].validateAsync instanceof Promise) {
                        hasExistingPromises = true;

                        return existingResults[fieldName].validateAsync.then((resolvedResult) =>
                            convertToFieldResult(fieldName, resolvedResult)
                        );
                    } else {
                        return convertToFieldResult(fieldName, existingResults[fieldName]);
                    }
                });
        }

        if (hasExistingPromises) {
            const existingReduced = {};

            const resolveExisting = Promise.all(existingPromises).then(
                (resolvedPromises) => resolvedPromises.reduce(applyNextResult, existingReduced)
            );

            if (result.validateAsync instanceof Promise) {
                result.validateAsync = Promise.all([result.validateAsync, resolveExisting])
                    .then(([resolvedResult, resolvedExisting]) =>
                        prepareResult(validatorProps, resolvedResult, validators, resolvedExisting)
                    );
            } else {
                const finalResult = {...result};

                result.validateAsync = resolveExisting
                    .then((resolvedExisting) =>
                        prepareResult(validatorProps, finalResult, validators, resolvedExisting)
                    );
            }
        } else if (result.validateAsync instanceof Promise) {
            result.validateAsync = result.validateAsync
                .then((resolvedResult) =>
                    prepareResult(validatorProps, resolvedResult, validators, existingResults)
                );
        }

        return prepareResult(validatorProps, result, validators, existingResults);
    }
}

function convertToFieldResult(fieldName, validationResult) {
    return {
        [fieldName]: validationResult
    };
}

function applyNextResult(previousResult, nextResult) {
    return {
        ...previousResult,
        ...nextResult
    };
}

function prepareResult(validatorProps, result, validators, existingResults) {
    const {props: resultProps, ...otherProps} = result;

    let validationResults = {
        ...existingResults,
        ...resultProps
    };

    const validationErrors = Object.keys(validationResults)
        .filter((fieldName) => !validationResults[fieldName].isValid)
        .map((fieldName) => ({
            fieldName,
            ...validationResults[fieldName]
        }));

    const isComplete = !(result.validateAsync instanceof Promise) &&
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
