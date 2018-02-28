# Validation Context

Validators sometimes need additional context at the time of validation. We've seen our `letter` validator can accept a letter parameter through a [validator factory](ValidatorFactories.md), but what if the comparison value isn't known until the time of validation? To support this, Strickland's `validate` function accepts a context argument after the value to be validated, and the context is passed to the validator.

Let's extend our `letter` validator to support the comparison letter being supplied as a function. That function will be called at the time of validation, supplying the context. This is added while retaining the ability to accept the comparison letter directly in the factory.

``` jsx
import validate from 'strickland';

function letter(letterParam) {
    return function validateLetter(value, context) {
        // Copy the param instead of overriding
        // `letterParam` with the function result
        let letterValue = letterParam;

        if (typeof letterValue === 'function') {
            letterValue = letterValue(context);
        }

        return (value === letterValue);
    }
}

const validator = letter((context) => context.letter);
const result = validate(validator, 'B', { letter: 'A' });

/*
    result = {
        isValid: false,
        value: 'B'
    }
 */
```

Strickland's `validate` function *always* passes a validation context object to the validator so that validators do not need to defend against undefined or null validation context.
