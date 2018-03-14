# Built-In Validator: range

The `range` validator combines the `min` and `max` validators to check that a value is within a range. Both the `min` and `max` values are inclusive.

If the value being validated is `null`, `false`, an empty string, or another falsy value other than `0`, then the result will be valid. This respects the rule of thumb described in the notes for the [required](required.md) validator.

## Named Props

* `min`: The minimum value compared against
* `max`: The maximum value compared against

## Parameters

The `range` validator supports three parameter signatures:

1. `range(min, max)` where the `min` and `max` named props are specified as values
1. `range(propsObject)` where the props object contains `min` and `max` named props
1. `range(propsFunction)` where the props function returns a props object with `min` and `max` named props

## Usage

``` jsx
import validate, {range} from 'strickland';

// As value parameters
const between5and10 = range(5, 10);

// As named props
const between10and20 = range({
    min: 10,
    max: 20,
    message: 'Must be between 10 and 20'
});

// As a function that resolves to have the named props
const rangeValidator = range((context) => ({
    min: context.min,
    max: context.max,
    message: `Must be between ${context.min} and ${context.max}`
}));
```
