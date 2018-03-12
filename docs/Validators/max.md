# Built-In Validator: max

The `max` validator checks that a numeric value is at most the maximum value provided.

## Named Props

* `max`: The maximum value compared against

## Usage

``` jsx
import validate, {max} from 'strickland';

// As a named prop
const maxOf2 = max({
    max: 2,
    message: 'Must be at most 2'
});

// As a function that resolves to have the named prop
const maxValidator = max((context) => ({
    max: context.max,
    message: `Must be at most ${context.max}`
}));
```
