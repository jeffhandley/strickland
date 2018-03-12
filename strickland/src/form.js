import validate from './validate';

export default function formValidator(validators, validatorProps) {
    if (typeof validators !== 'object' || Array.isArray(validators) || !validators) {
        throw 'Strickland: The `form` validator expects an object';
    }

    function validateForm(value, context) {
        const props = typeof validatorProps === 'function' ?
            validatorProps(context) :
            validatorProps;

        const fieldValidators = Object.keys(validators)
            .filter(shouldValidateField.bind(null, validators, props, context))
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

        return prepareResult(validators, props, existingResults, result);
    }

    validateForm.emptyResults = function emptyResults() {
        return {
            form: {
                validationResults: {},
                validationErrors: [],
                isComplete: false
            }
        };
    };

    validateForm.validateFields = function validateField(formValues, fields, result) {
        result = result || validateForm.emptyResults();

        const context = {
            ...result,
            form: {
                ...result.form,
                fields
            }
        };

        return validate(validateForm, formValues, context);
    };

    validateForm.updateFieldResult = function updateFieldResult(result, fieldName, fieldResult) {
        const formValues = {
            ...result.value,
            [fieldName]: (fieldResult && fieldResult.value) || result.value[fieldName]
        };

        const context = {
            ...result,
            form: {
                ...result.form,
                fields: [], // no validation; just refresh the result properties
                validationResults: {
                    ...result.form.validationResults,
                    [fieldName]: fieldResult
                }
            }
        };

        return validate(validateForm, formValues, context);
    };

    return validateForm;
}

function shouldValidateField(validators, props, context, fieldName) {
    const formFields = (
        context &&
        context.form &&
        context.form.fields
    ) || (props && props.fields);

    return validators[fieldName] && (!formFields || formFields.indexOf(fieldName) !== -1);
}

function prepareResult(validators, props, existingResults, result) {
    let {objectProps, validateAsync, ...otherProps} = result;

    const existingDefinedResults = Object.keys(existingResults)
        .map((fieldName) => existingResults[fieldName] ? ({[fieldName]: existingResults[fieldName]}) : {})
        .reduce((definedResults, fieldResult) => ({
            ...definedResults,
            ...fieldResult
        }), {});

    let validationResults = {
        ...existingDefinedResults,
        ...objectProps
    };

    const validationErrors = Object.keys(validationResults)
        .filter((fieldName) => !validationResults[fieldName].isValid)
        .filter((fieldName) => !validationResults[fieldName].validateAsync)
        .map((fieldName) => ({
            fieldName,
            ...validationResults[fieldName]
        }));

    const existingResultFields = Object.keys(existingDefinedResults)
        .filter((fieldName) => !objectProps[fieldName]);

    const hasExistingAsyncResults = existingResultFields
        .some((fieldName) => existingDefinedResults[fieldName].validateAsync);

    if (hasExistingAsyncResults || validateAsync) {
        const resultValidateAsync = validateAsync || (() => result);

        validateAsync = function resolveAsync(asyncValue, asyncContext) {
            function resolveFieldResult(fieldName) {
                const shouldResolve = existingDefinedResults[fieldName].validateAsync &&
                    shouldValidateField(validators, props, asyncContext, fieldName);

                const fieldPromise = shouldResolve ?
                    existingDefinedResults[fieldName].validateAsync() :
                    Promise.resolve(existingDefinedResults[fieldName]);

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
                    prepareResult(validators, props, resolvedExistingResults, resolvedResult)
                );
        }
    }

    const isComplete = !validateAsync &&
        arraysEqual(Object.keys(validators).sort(), Object.keys(validationResults).sort());

    const isValid = isComplete &&
        result.isValid &&
        validationErrors.length === 0;

    const preparedResult = {
        ...props,
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
