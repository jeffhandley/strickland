# Built-In Validator: form

The `form` validator performs both field-level and form-level validation. Field validators are supplied the same way `objectProps` validators are supplied as an object with the shape matching the form fields. The `form` validator also allows previous validation results to be provided on context so that results can be updated with the new results merged in.

## Parameters

The first parameter to the `form` validator factory is an object defining the properties to be validated on objects. Validator props can also be supplied either as an object or as a function that accepts context and returns a validator props object.

## Validation Context

The `form` validator utilizes validation context to perform field-level validation as well as to update previous validation results. Without any context provided, the entire form will be validated without using any previous validation results.

### Field-Level Validation: `form.fields`

The `form.fields` context prop indicates which field(s) to validate.

* If `form.fields` is an array of strings, all items are treated as field names
* If `form.fields` is not supplied, all fields are validated
* If `form.fields` is an _empty_ array, no fields are validated

In all cases, the rest of the form validation results will be refreshed, including the `validationErrors` array and the possible `validateAsync` function that captures remaining async validation.

### Previous Validation Results: `form.validationResults`

Validation results from earlier validation can be supplied using `form.validationResults`. These existing results will be retained, but any fields that are re-validated will be overwritten with their new results.

## Result Properties

* `form.validationResults`: An object with properties matching those validated, with the values of the properties representing the validation results. If the `form.validationResults` and `form.fields` context props were used, then previous validation results that were not re-validated will be retained.
* `form.validationErrors`: An array of validation results that are invalid, but excluding results where async validation remains to be completed.
* `form.isComplete`: A boolean indicating whether the entire form has been validated. `true` when `form.validationResults` contains results for all field validators and none of those results has a `validateAsync` yet to be resolved.

## Usage

The sample code below demonstrates validating a form with field-level validation, incrementally building up validation results.

``` jsx
import validate, {
    form, required, length, range
} from 'strickland';

const validatePerson = form({
    firstName: [
        required(),
        length(2, 20)
    ],
    lastName: [
        required(),
        length(2, 20)
    ],
    birthYear: range(1900, 2018)
});

// Initialize the person with only a firstName
let person = {
    firstName: 'Stanford'
};

// Validate the firstName field
let result = validate(validatePerson, person, {
    form: {
        fields: ['firstName']
    }
});

/*
    result = {
        isValid: false,
        value: {
            firstName: 'Stanford'
        },
        form: {
            isComplete: false,
            validationResults: {
                firstName: {
                    isValid: true,
                    value: 'Stanford',
                    required: true,
                    minLength: 2,
                    maxLength: 20
                }
            },
            validationErrors: []
        }
    }
 */

// Add the lastName field
person = {
    firstName: 'Stanford',
    lastName: 'Strickland'
};

// Validate the lastName field, build on
// previous form validation results
result = validate(validatePerson, person, {
    form: {
        ...result.form,
        fields: ['lastName']
    }
});

/*
    result = {
        isValid: false,
        value: {
            firstName: 'Stanford',
            lastName: 'Strickland'
        },
        form: {
            isComplete: false,
            validationResults: {
                firstName: {
                    isValid: true,
                    value: 'Stanford',
                    required: true,
                    minLength: 2,
                    maxLength: 20
                },
                lastName: {
                    isValid: true,
                    value: 'Strickland',
                    required: true,
                    minLength: 2,
                    maxLength: 20
                }
            },
            validationErrors: []
        }
    }
 */

// Add a birthYear (that is invalid)
person = {
    ...person,
    birthYear: 2020
};

// Validate the birthYear field
result = validate(validatePerson, person, {
    form: {
        ...result.form,
        fields: ['birthYear']
    }
});

/*
    result = {
        isValid: false,
        value: {
            firstName: 'Stanford',
            lastName: 'Strickland'
        },
        form: {
            isComplete: true,
            validationResults: {
                firstName: {
                    isValid: true,
                    value: 'Stanford',
                    required: true,
                    minLength: 2,
                    maxLength: 20
                },
                lastName: {
                    isValid: true,
                    value: 'Strickland',
                    required: true,
                    minLength: 2,
                    maxLength: 20
                },
                birthYear: {
                    isValid: false,
                    value: 2020,
                    min: 1900,
                    max: 2018
                }
            },
            validationErrors: [
                {
                    fieldName: 'birthYear',
                    isValid: false,
                    value: 2020,
                    min: 1900,
                    max: 2018
                }
            ]
        }
    }
 */

// Revalidate the entire form, passing
// previous validation results in
result = validate(validatePerson, person, result);
```
