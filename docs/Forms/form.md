# Built-In Validator: form

The `form` validator performs validation on every field of a form for which validators are defined. The field validators are supplied as an object with the shape matching the form values object.

## Parameters

The first parameter to the `form` validator factory is an object defining the properties to be validated on objects. Validator props can also be supplied either as an object or as a function that accepts context and returns a validator props object.

## Validation Context

### Which Fields to Validate: `form.fields`

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

``` jsx
import validate, {
    form, required, length, range
} from 'strickland';

const validatePerson = form({
    firstName: [
        required(),
        length({minLength: 2, maxLength: 20})
    ],
    lastName: [
        required(),
        length({minLength: 2, maxLength: 20})
    ],
    birthYear: range({min: 1900, max: 2018})
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
```

## Async Validation

Async validation works naturally with the `form` validator. Any validator within the form validation can use async validation. As is seen with `objectProps` and other composition validators, an async validator within a form will result in a `validateAsync` function on the validation result.

### Executing `validateAsync` for Specific Fields

By default, the `validateAsync` function returned on the validation result will resolve async validation for all fields that have remaining async validation. But, the `validateAsync` function also accepts a context parameter that allows specific fields to be resolved using the same `form.fields` behavior defined above.

``` jsx
// Execute async validation only for the username field
result.validateAsync({
    form: {
        fields: ['username']
    }
});
```

### Two-Stage Validation

[Two-Stage Validation](/../Async/TwoStageValidation.md) is commonly used with forms where standard validation occurs synchronously with results immediately rendered, but async validation that calls an API will be rendered when the response comes back.
