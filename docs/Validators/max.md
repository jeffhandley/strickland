# Built-In Validator: max

The `max` validator checks that a numeric value is at most the maximum value provided.

## Named Props

* `max`: The maximum value compared against
    * If the parameter supplied is numeric, it will be used as the `max` named prop

## Usage

``` jsx
import validate, {max} from 'strickland';

// Using a numeric param to specify the max value
const maxOf3 = max(3);

// As a named prop
const maxOf2 = max({
    max: 2,
    message: 'Must be at most 2'
});

// Using a function that resolves to specify the max value
const maxValidatorA = max((context) => context.max);

// As a function that resolves to have the named prop
const maxValidatorB = max((context) => ({
    max: context.max,
    message: `Must be at most ${context.max}`
}));
```
