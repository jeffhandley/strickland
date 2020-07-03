# maxLength

The `maxLength` validator checks that a string value has a length at most the maximum length provided.

If the value being validated is `null` or an empty string, then the result will be valid. This respects the rule of thumb described in the notes for the [required](required.md) validator.

## Named Props

* `maxLength`: The maximum length compared against

## Parameters

The `maxLength` validator supports three parameter signatures:

1. `maxLength(value)` where the value is used as the `maxLength` named prop
2. `maxLength(propsObject)` where the props object contains a `maxLength` named prop
3. `maxLength(propsFunction)` where the props function returns a props object with a `maxLength` named prop

## Usage

```jsx
import validate, {maxLength} from 'strickland';

// As a value parameter
const maxLengthOf3 = maxLength(3);

// As a named prop
const maxLengthOf2 = maxLength({
    maxLength: 2,
    message: 'Must have a length of at most 2'
});

// As a function that resolves to have the named prop
const maxLengthValidator = maxLength((context) => ({
    maxLength: context.maxLength,
    message: `Must have a length of at most ${context.maxLength}`
}));
```

