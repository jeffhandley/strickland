# Built-In Validator: minLength

The `minLength` validator checks that a string value has a length at least the minimum length provided.

## Named Props

* `minLength`: The minimum length compared against

## Parameters

The `minLength` validator supports three parameter signatures:

1. `minLength(value)` where the value is used as the `minLength` named prop
1. `minLength(propsObject)` where the props object contains a `minLength` named prop
1. `minLength(propsFunction)` where the props function returns a props object with a `minLength` named prop

## Usage

``` jsx
import validate, {minLength} from 'strickland';

// As a value parameter
const minLengthOf3 = minLength(3);

// As a named prop
const minLengthOf2 = minLength({
    minLength: 2,
    message: 'Must have a length of at least 2'
});

// As a function that resolves to have the named prop
const minLengthValidator = minLength((context) => ({
    minLength: context.minLength,
    message: `Must have a length of at least ${context.minLength}`
}));
```
