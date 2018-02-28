# Built-In Validator: maxLength

The `maxLength` validator checks that a string value has a length at most the maximum length provided.

## Named Props

* `maxLength`: The maximum length compared against

## Usage

The following code illustrates all the ways the maximum length can be supplied.

``` jsx
import validate, {maxLength} from 'strickland';

// As the first parameter to the factory
const a = maxLength(
    1,
    {message: 'Must have a length of at least 1'}
);

// As a named prop
const b = maxLength({
    maxLength: 2,
    message: 'Must have a length of at least 2'
});

// As a function that resolves to the maxLength value
const c = maxLength(
    (context) => 3,
    {message: 'Must have a length of at least 3'}
);

// As a function that resolves to have the named prop
const d = maxLength((context) => ({
    maxLength: context.maxLength,
    message: `Must have a length of at least ${context.maxLength}`
}));
```
