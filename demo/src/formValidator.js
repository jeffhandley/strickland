import classnames from 'classnames';
import {form, every, required, minLength, compare} from 'strickland';

function usernameIsAvailable(username) {
    return {
        isValid: false,
        message: `Checking availability of "${username}"...`,
        validateAsync: () => new Promise((resolve) => {
            setTimeout(() => {
                const isValid = (username !== 'marty')
                resolve({
                    isValid,
                    message: isValid ? `"${username}" is available` : `Sorry, "${username}" is not available`
                });
            }, 2000);
        })
    };
}

export default form({
    firstName: required({message: 'Required'}),
    lastName: [
        required({message: 'Required'}),
        minLength(2, {message: 'Must have at least 2 characters'})
    ],
    username: [
        required({message: 'Required'}),
        minLength(4, {message: 'Must have at least 4 characters'}),
        usernameIsAvailable
    ],
    password: every(
        [required(), minLength(8)],
        {message: 'Must have at least 8 characters'}
    ),
    confirmPassword: every(
        [required(), compare(({form}) => form.values.password)],
        {message: 'Must match password'}
    )
});

export function getValidationClassName(form, validation, fieldName) {
    const fieldValidation = validation && validation.form && validation.form.validationResults[fieldName];

    return classnames({
        'validation-value': !!form[fieldName],
        'validation-valid': fieldValidation && fieldValidation.isValid,
        'validation-async': fieldValidation && fieldValidation.validateAsync,
        'validation-invalid': fieldValidation && !fieldValidation.isValid && !fieldValidation.validateAsync
    });
}

export function getValidationMessage(validation, fieldName) {
    const fieldValidation = validation && validation.form && validation.form.validationResults[fieldName];

    if (fieldValidation && !fieldValidation.isValid) {
        return fieldValidation.message;
    }
}
