# Built-In Validator: range

The `range` validator combines the `min` and `max` validators to check that a value is within a range. Both the `min` and `max` values are inclusive.

## Named Props

* `min`: The minimum value compared against
* `max`: The maximum value compared against

## Usage

The `min` and `max` props can be supplied either as parameters or as named props. Functions can be used to resolve both `min` and `max` as well, and a function can also be used to resolve to an object with named props. There are many combinations that ultimately provide the `min` and `max` values, but the following code illustrates the common usages.

``` jsx
import validate, {range} from 'strickland';

// As the first two parameters to the factory
const a = range(
    10,
    20,
    {message: 'Must be between 10 and 20'}
);

// As named props
const b = range({
    min: 10,
    max: 20,
    message: 'Must be between 10 and 20'
});

// As functions that resolve the min and max values
const c = range((context) =>
    10,
    (context) => 20,
    {message: 'Must be between 10 and 20'}
);

// As a function that resolves to have the named props
const d = range((context) => ({
    min: context.min,
    max: context.max,
    message: `Must be between ${context.min} and ${context.max}`
}));
```
