# Built-In Validator: compare

The `compare` validator is quite similar to the letter validator we've built in our examples. In fact, it only has one additional behavior. If the value being validated is `null`, `false`, an empty string, or another falsy value other than `0`, then the result will be valid. This respects the rule of thumb described in the notes for the [required](./required.md) validator.

## Named Props

* `compare`: The value compared against

## Parameters

The `compare` validator supports three parameter signatures:

1. `compare(value)` where the value is used as the `compare` named prop
1. `compare(propsObject)` where the props object contains a `compare` named prop
1. `compare(propsFunction)` where the props function returns a props object with a `compare` named prop

## Usage

``` jsx
import validate, {compare} from 'strickland';

// As a value parameter
const letterA = compare('A');

// As a named prop
const letterB = compare({
    compare: 'B',
    message: 'Must be the letter "B"'
});

// Using a function that resolves to have the named prop
const letterValidator = compare((context) => ({
    compare: context.compare,
    message: `Must match "${context.compare}"`
}));
```
