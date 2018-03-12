# Built-In Validator: min

The `min` validator checks that a numeric value is at least the minimum value provided.

## Named Props

* `min`: The minimum value compared against
    * If the parameter supplied is numeric, it will be used as the `min` named prop

## Usage

``` jsx
import validate, {min} from 'strickland';

// Using a numeric param to specify the min value
const minOf3 = min(3);

// As a named prop
const minOf2 = min({
    min: 2,
    message: 'Must be at least 2'}
);

// Using a function that resolves to specify the min value
const maxValidatorA = min((context) => context.min);

// As a function that resolves to have the named prop
const minValidatorB = min((context) => ({
    min: context.min,
    message: `Must be at least ${context.min}`
}));
```
