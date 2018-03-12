# Built-In Validator: maxLength

The `maxLength` validator checks that a string value has a length at most the maximum length provided.

## Named Props

* `maxLength`: The maximum length compared against
    * If the parameter supplied is numeric, it will be used as the `maxLength` named prop

## Usage

``` jsx
import validate, {maxLength} from 'strickland';

// Using a numeric param to specify the maxLength value
const maxLengthOf3 = maxLength(3);

// As a named prop
const maxLengthOf2 = maxLength({
    maxLength: 2,
    message: 'Must have a length of at most 2'
});

// Using a function that resolves to specify the max value
const maxLengthValidatorA = max((context) => context.maxLength);

// As a function that resolves to have the named prop
const maxLengthValidatorB = maxLength((context) => ({
    maxLength: context.maxLength,
    message: `Must have a length of at most ${context.maxLength}`
}));
```
