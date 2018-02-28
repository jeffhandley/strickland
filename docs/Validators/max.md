# Built-In Validator: max

The `max` validator checks that a numeric value is at most the maximum value provided.

## Named Props

* `max`: The maximum value compared against

## Usage

The following code illustrates all the ways the maximum value can be supplied.

``` jsx
import validate, {max} from 'strickland';

// As the first parameter to the factory
const a = max(
    1,
    {message: 'Must be at most 1'}
);

// As a named prop
const b = max({
    max: 2,
    message: 'Must be at most 2'
});

// As a function that resolves to the max value
const c = max(
    (context) => 3,
    {message: 'Must be at most 3'}
);

// As a function that resolves to have the named prop
const d = max((context) => ({
    max: context.max,
    message: `Must be at most ${context.max}`
}));
```
