import validate from './validate';

export default function form(validators) {
    if (typeof validators !== 'object' || Array.isArray(validators) || !validators) {
        throw 'Strickland: form expects an object';
    }

    return function validateForm(values, context) {
        context = {
            ...context,
            form: {
                ...(context && context.form),
                values
            }
        };

        let {
            validationResults: existingResults,
            validationErrors, // eslint-disable-line no-unused-vars
            ...formContext
        } = context.form;

        let validationContext = {
            ...context,
            form: formContext
        };

        if (formContext.fields && !Array.isArray(formContext.fields)) {
            formContext.fields = [formContext.fields];
        }

        function shouldValidateField(fieldName) {
            return validators[fieldName] && (!formContext.fields || formContext.fields.indexOf(fieldName) !== -1);
        }

        let fieldValidators = validators;

        if (formContext.fields) {
            fieldValidators = {};

            Object.keys(validators).filter(shouldValidateField).forEach((fieldName) => {
                fieldValidators = {
                    ...fieldValidators,
                    [fieldName]: validators[fieldName]
                };
            });
        }

        const result = validate(fieldValidators, values, validationContext);

        let hasExistingPromises = false;
        let existingPromises;
        result.existingPromiseNames = [];

        if (existingResults) {
            existingPromises = Object.keys(existingResults)
                .filter((fieldName) => !shouldValidateField(fieldName))
                .map((fieldName) => {
                    if (existingResults[fieldName].validateAsync instanceof Promise) {
                        hasExistingPromises = true;
                        result.existingPromiseNames.push(fieldName);

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

            const resolveExisting = Promise.all(existingPromises)
                .then((resolvedPromises) =>
                    resolvedPromises.reduce(applyNextResult, existingReduced)
                );

            if (result.validateAsync instanceof Promise) {
                result.validateAsync = Promise.all([result.validateAsync, resolveExisting])
                    .then(([resolvedResult, resolvedExisting]) =>
                        prepareResult(resolvedResult, validators, formContext, resolvedExisting)
                    );
            } else {
                const finalResult = {...result};

                result.validateAsync = resolveExisting
                    .then((resolvedExisting) =>
                        prepareResult(finalResult, validators, formContext, resolvedExisting)
                    );
            }
        } else if (result.validateAsync instanceof Promise) {
            result.validateAsync = result.validateAsync
                .then((resolvedResult) =>
                    prepareResult(resolvedResult, validators, formContext, existingResults)
                );
        }

        return prepareResult(result, validators, formContext, existingResults);
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

function prepareResult(result, validators, formContext, existingResults) {
    let validationResults = {
        ...existingResults,
        ...result.props
    };

    const validationErrors = Object.keys(validationResults)
        .filter((fieldName) => !validationResults[fieldName].isValid)
        .map((fieldName) => ({
            fieldName,
            ...validationResults[fieldName]
        }));

    let isComplete = !(result.validateAsync instanceof Promise);

    if (isComplete && formContext.fields) {
        isComplete = arraysEqual(Object.keys(validators).sort(), Object.keys(validationResults).sort());
    }

    const isValid = isComplete && result.isValid && validationErrors.length === 0;

    const preparedResult = {
        ...result,
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
