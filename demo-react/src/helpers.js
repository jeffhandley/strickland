import classnames from 'classnames';

export function getValidationClassName(formValues, validation, fieldName) {
    const fieldValidation = validation && validation.form && validation.form.validationResults[fieldName];

    return classnames({
        'validation-value': !!formValues[fieldName],
        'validation-valid': fieldValidation && fieldValidation.isValid,
        'validation-async': fieldValidation && fieldValidation.validateAsync,
        'validation-invalid': fieldValidation && !fieldValidation.isValid && !fieldValidation.validateAsync
    });
}

export function getValidationMessage(validation, fieldName) {
    const fieldValidation = validation && validation.form && validation.form.validationResults[fieldName];

    if (fieldValidation && !fieldValidation.isValid) {
        return fieldValidation.message;
    } else if (fieldValidation) {
        return fieldValidation.successMessage;
    }
}
