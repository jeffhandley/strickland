# Validation Context

Validators sometimes need additional context at the time of validation. We've seen our `letter` validator can accept a letter parameter through a [validator factory](ValidatorFactories.md), but what if the comparison value isn't known until the time of validation? To support this, Strickland's `validate` function accepts a context argument after the value to be validated, and the context is passed to the validator.

Let's extend our `letter` validator to support a comparison letter being supplied at the time of validation while retaining the ability to accept it in the factory.

``` jsx
import validate from 'strickland';

function letter(letterParam) {
    return function validateLetter(value, validationContext) {
        validationContext = {
            letter: letterParam,
            ...validationContext
        };

        return (value === validationContext.letter);
    }
}

const validator = letter();
const result = validate(validator, 'B', { letter: 'A' });

/*
result = {
    isValid: false,
    value: 'B'
}
*/
```

While not enforced by Strickland, validators generally apply validation context after validator factory parameters; this allows applications to override parameters at the time of validation when needed.

Strickland's `validate` function *always* passes a validation context object to the validator so that validators do not need to defend against undefined or null validation context.
