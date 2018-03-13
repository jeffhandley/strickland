# Built-In Validator: min

The `min` validator checks that a numeric value is at least the minimum value provided.

## Named Props

* `min`: The minimum value compared against

## Parameters

The `min` validator supports three parameter signatures:

1. `min(value)` where the value is used as the `min` named prop
1. `min(propsObject)` where the props object contains a `min` named prop
1. `min(propsFunction)` where the props function returns a props object with a `min` named prop

## Usage

``` jsx
import validate, {min} from 'strickland';

// As a value parameter
const minOf3 = min(3);

// As a named prop
const minOf2 = min({
    min: 2,
    message: 'Must be at least 2'}
);

// As a function that resolves to have the named prop
const minValidator = min((context) => ({
    min: context.min,
    message: `Must be at least ${context.min}`
}));
```
