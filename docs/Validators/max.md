# Built-In Validator: max

The `max` validator checks that a numeric value is at most the maximum value provided.

If the value being validated is `null`, `false`, an empty string, or another falsy value other than `0`, then the result will be valid. This respects the rule of thumb described in the notes for the [required](required.md) validator.

## Named Props

* `max`: The maximum value compared against

## Parameters

The `max` validator supports three parameter signatures:

1. `max(value)` where the value is used as the `max` named prop
1. `max(propsObject)` where the props object contains a `max` named prop
1. `max(propsFunction)` where the props function returns a props object with a `max` named prop

## Usage

``` jsx
import validate, {max} from 'strickland';

// As a value parameter
const maxOf3 = max(3);

// As a named prop
const maxOf2 = max({
    max: 2,
    message: 'Must be at most 2'
});

// As a function that resolves to have the named prop
const maxValidator = max((context) => ({
    max: context.max,
    message: `Must be at most ${context.max}`
}));
```
