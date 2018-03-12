# Built-In Validator: length

The `length` validator combines the `minLength` and `maxLength` validators to check that the length of a string value is within a range. Both the `minLength` and `maxLength` values are inclusive.

## Named Props

* `minLength`: The minimum value compared against
* `maxLength`: The maximum value compared against

## Usage

``` jsx
import validate, {length} from 'strickland';

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
