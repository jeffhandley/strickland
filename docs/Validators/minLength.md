# Built-In Validator: minLength

The `minLength` validator checks that a string value has a length at least the minimum length provided.

## Named Props

* `minLength`: The minimum length compared against

## Usage

``` jsx
import validate, {minLength} from 'strickland';

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
