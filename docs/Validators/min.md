# Built-In Validator: min

The `min` validator checks that a numeric value is at least the minimum value provided.

## Named Props

* `min`: The minimum value compared against

## Usage

``` jsx
import validate, {min} from 'strickland';

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
