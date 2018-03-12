# Form Validation Helper: emptyResults

Applications that maintain validation state for interaction generally need to initialize the state with an empty validation result. Strickland's `form` validator provides an `emptyResults()` helper function to simplify that need.

## Usage

``` jsx
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

let validationResult = validatePerson.emptyResults();

/*
    validationResult = {
        form: {
            validationResults: {},
            validationErrors: [],
            isComplete: false
        }
    }
 */
```
