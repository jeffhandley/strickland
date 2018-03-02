# Built-In Validator: minLength

The `minLength` validator checks that a string value has a length at least the minimum length provided.

## Named Props

* `minLength`: The minimum length compared against

## Usage

The following code illustrates all the ways the minimum length can be supplied.

``` jsx
import validate, {minLength} from 'strickland';

// As the first parameter to the factory
const a = minLength(
    1,
    {message: 'Must have a length of at least 1'}
);

// As a named prop
const b = minLength({
    minLength: 2,
    message: 'Must have a length of at least 2'
});

// As a function that resolves to the minLength value
const c = minLength((context) =>
    3,
    {message: 'Must have a length of at least 3'}
);

// As a function that resolves to have the named prop
const d = minLength((context) => ({
    minLength: context.minLength,
    message: `Must have a length of at least ${context.minLength}`
}));
```
