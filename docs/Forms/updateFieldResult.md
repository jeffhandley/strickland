# Form Validation Helper: updateFieldResult

In some scenarios, validation results need to be produced outside the flow of calling into Strickland to perform validation. For example, an API call might perform server-side validation and return validation results that need to be populated into your application's validation result state.

To assist with such scenarios, Strickland's `form` validator offers an `updateFieldResult` helper function that can update existing validation results with new field results.

## Usage

```jsx
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

let stanfordStrickland = {
    firstName: 'Stanford',
    lastName: 'Strickland',
    birthYear: 1925
};

let stanfordResult = validate(validatePerson, stanfordStrickland);

let firstNameResult = {
    isValid: false,
    value: 'Stanford',
    message: 'The service does not allow a first name of "Stanford"'
};

stanfordResult = validatePerson.updateFieldResult(stanfordResult, 'firstName', firstNameResult);

/*
    stanfordResult = {
        form: {
            validationResults: {
                firstName: {
                    isValid: false,
                    value: 'Stanford',
                    message: 'The service does not allow a first name of "Stanford"'
                },
                lastName: {
                    isValid: true
                },
                birthYear: {
                    isValid: true
                }
            },
            validationErrors: [
                {
                    fieldName: 'firstName',
                    isValid: false,
                    value: 'Stanford',
                    message: 'The service does not allow a first name of "Stanford"'
                }
            ],
            isComplete: true
        }
    }
 */
```
