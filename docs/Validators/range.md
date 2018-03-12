# Built-In Validator: range

The `range` validator combines the `min` and `max` validators to check that a value is within a range. Both the `min` and `max` values are inclusive.

## Named Props

* `min`: The minimum value compared against
* `max`: The maximum value compared against

## Usage

``` jsx
import validate, {range} from 'strickland';

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
