# Built-In Validator: length

The `length` validator combines the `minLength` and `maxLength` validators to check that the length of a string value is within a range. Both the `minLength` and `maxLength` values are inclusive.

If the value being validated is `null` or an empty string, then the result will be valid. This respects the rule of thumb described in the notes for the [required](required.md) validator.

## Named Props

* `minLength`: The minimum value compared against
* `maxLength`: The maximum value compared against

## Parameters

The `length` validator supports three parameter signatures:

1. `length(minLength, maxLength)` where the `minLength` and `maxLength` named props are specified as values
1. `length(propsObject)` where the props object contains `minLength` and `maxLength` named props
1. `length(propsFunction)` where the props function returns a props object with `minLength` and `maxLength` named props

## Usage

``` jsx
import validate, {length} from 'strickland';

// As value parameters
const maxLengthBetween5and10 = length(5, 10);

// As named props
const maxLengthBetween10and20 = length({
    minLength: 10,
    maxLength: 20,
    message: 'Must have a length between 10 and 20'
});

// As a function that resolves to have the named props
const lengthValidator = length((context) => ({
    minLength: context.minLength,
    maxLength: context.maxLength,
    message: `Must have a length between ${context.minLength} and ${context.maxLength}`
}));
```
