# Built-In Validator: length

The `length` validator combines the `minLength` and `maxLength` validators to check that the length of a string value is within a range. Both the `minLength` and `maxLength` values are inclusive.

## Named Props

* `minLength`: The minimum value compared against
* `maxLength`: The maximum value compared against

## Usage

The `minLength` and `maxLength` props can be supplied either as parameters or as named props. Functions can be used to resolve both `minLength` and `maxLength` as well, and a function can also be used to resolve to an object with named props. There are many combinations that ultimately provide the `minLength` and `maxLength` values, but the following code illustrates the common usages.

``` jsx
import validate, {length} from 'strickland';

// As the first two parameters to the factory
const a = length(
    10,
    20,
    {message: 'Must have a length between 10 and 20'}
);

// As named props
const b = length({
    minLength: 10,
    maxLength: 20,
    message: 'Must have a length between 10 and 20'
});

// As functions that resolve the minLength and maxLength values
const c = length(
    (context) => 10,
    (context) => 20,
    {message: 'Must have a length between 10 and 20'}
);

// As a function that resolves to have the named props
const d = length((context) => ({
    minLength: context.minLength,
    maxLength: context.maxLength,
    message: `Must have a length between ${context.minLength} and ${context.maxLength}`
}));
```
