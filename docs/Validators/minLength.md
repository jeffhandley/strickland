# Built-In Validator: minLength

The `minLength` validator checks that a string value has a length at least the minimum length provided.

## Named Props

* `minLength`: The minimum length compared against
    * If the parameter supplied is numeric, it will be used as the `minLength` named prop

## Usage

``` jsx
import validate, {minLength} from 'strickland';

// Using a numeric param to specify the minLength value
const minLengthOf3 = minLength(3);

// As a named prop
const minLengthOf2 = minLength({
    minLength: 2,
    message: 'Must have a length of at least 2'
});

// Using a function that resolves to specify the max value
const minLengthValidatorA = max((context) => context.minLength);

// As a function that resolves to have the named prop
const minLengthValidatorB = minLength((context) => ({
    minLength: context.minLength,
    message: `Must have a length of at least ${context.minLength}`
}));
```
