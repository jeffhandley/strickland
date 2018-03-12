# Built-In Validator: maxLength

The `maxLength` validator checks that a string value has a length at most the maximum length provided.

## Named Props

* `maxLength`: The maximum length compared against

## Usage

``` jsx
import validate, {maxLength} from 'strickland';

// As a named prop
const maxLengthOf2 = maxLength({
    maxLength: 2,
    message: 'Must have a length of at most 2'
});

// As a function that resolves to have the named prop
const maxLengthValidator = maxLength((context) => ({
    maxLength: context.maxLength,
    message: `Must have a length of at most ${context.maxLength}`
}));
```
