# validateFields

We saw that the `form` validator supports the ability to perform field-level validation in addition to form-level validation. To validate one or some fields, an array of field names can be supplied in the validation context. While straightforward, this code is verbose. For that reason, Strickland's `form` validator provides a `validateFields` helper function.

Here is some application code that performs field-level validation without the `validateFields` helper.

```jsx
import validate, {
    form, required, length, range
} from 'strickland';

const personValidator = form({
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
let result = validate(personValidator, person, {
    form: {
        fields: ['firstName']
    }
});
```

The `validateFields` helper is available from the validator created using the `form` validator factory.

```jsx
import validate, {
    form, required, length, range
} from 'strickland';

const personValidator = form({
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
let validationResult = personValidator.validateFields(person, ['firstName']);
```

Once initial validation has occurred, `validateFields` can accept existing validation results to be updated during field-level validation.

```jsx
// The firstName field has already been validated
// Validate the lastName field

validationResult = personValidator.validateFields(
    person,
    ['lastName'],
    validationResult
);
```
