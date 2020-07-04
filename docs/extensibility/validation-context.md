# Validation Context

Validators sometimes need additional context at the time of validation. We've seen our letter validator can accept a letter prop through a [validator factory](validator-factories.md), but what if the comparison value isn't known until the time of validation? To support this, Strickland's `validate` function accepts a context argument after the value to be validated, and the context is passed to the validator. Validators can then utilize context to determine validator prop values.

Let's extend our letter validator to support the validator props being supplied as a function. That function will be called at the time of validation, supplying the context. This is added while retaining the ability to accept the letter prop directly in the factory.

```jsx
import validate from 'strickland';

function letterValidator(validatorProps) {
    return function validateLetter(value, context) {
        // Be sure not to overwrite the original
        // validatorProps variable
        let resolvedProps = validatorProps;

        if (typeof resolvedProps === 'function') {
            resolvedProps = resolvedProps(context);
        }

        resolvedProps = resolvedProps || {};

        const {letter} = resolvedProps;
        return (value === letter);
    }
}

const validator = letterValidator((context) => ({letter: context.letter}));
const result = validate(validator, 'B', {letter: 'B'});

/*
    result = {
        isValid: true,
        value: 'B'
    }
 */
```

Strickland's `validate` function _always_ passes a validation context object to the validator so that validators do not need to defend against undefined or null validation context. The value being validated will always be provided on the validation context as a `value` context prop.

