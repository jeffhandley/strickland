# Validating Forms

Let's face it: we're trying to validate forms in the user interface. Yes, Strickland is decoupled from the UI and it _can_ be used in other scenarios (like APIs), but form validation is the primary use case.

With the `props` validator, Strickland gets pretty close to providing form validation; it just falls short in one key way. The `props` validator is great if the entire form is being validated in one shot, but it doesn't support validating field-by-field. You can certainly build a `props` validator object and conditionally pluck props off of it and dynamically build your `props` validator. It works; it's just a lot of work.

To simplify this scenario, Strickland provides a `form` validator that behaves similarly to `props`, but it has additional features for field-by-field validation where a form's validation results are built up incrementally.

Let's take a look.

``` jsx
import validate, {
    form, required, length, range
} from 'strickland';

const validatePerson = form({
    firstName: [required(), length(2, 20)],
    lastName: [required(), length(2, 20)],
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
            firstName: 'Strickland'
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

## Form Context Props

### Which Fields to Validate: `form.fields`

The `form.fields` context prop indicates which field(s) to validate.

* If `form.fields` is a string, it is treated as a single field
* If `form.fields` is an array, all items are treated as field names
* If `form.fields` is not supplied, all fields are validated

### Previous Validation Results: `form.validationResults`

Validation results from earlier validation can be supplied using `form.validationResults`. These existing results will be retained, but any fields that are re-validated will be overwritten with their new results.

## Async Validation

Async validation works naturally with the `form` validator. Any validator within the form validation can use async validation. As is seen with `props` and other composition validators, an async validator within a form will result in a `validateAsync` prop on the form validation results.

[Two-Stage Validation](/../Async/TwoStageValidation.md) is commonly used with forms where standard validation occurs synchronously with results immediately rendered, but async validation that calls an API will be rendered when the response comes back.

### Timing Pitfall

A common pitfall with async validation on forms is to ensure a field's value hasn't changed during async validation. When your application receives async validation results, be sure to check that the current value still matches the value that was validated before rendering the validation result.

Fortunately, every validation result from Strickland includes the `value` that was validated as a result prop, making this straightforward.
