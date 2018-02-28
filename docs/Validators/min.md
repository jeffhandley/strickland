# Built-In Validator: min

The `min` validator checks that a numeric value is at least the minimum value provided.

## Named Props

* `min`: The minimum value compared against

## Usage

The following code illustrates all the ways the minimum value can be supplied.

``` jsx
import validate, {min} from 'strickland';

// As the first parameter to the factory
const a = min(
    1,
    {message: 'Must be at least 1'}
);

// As a named prop
const b = min({
    min: 2,
    message: 'Must be at least 2'}
);

// As a function that resolves to the min value
const c = min((context) =>
    3,
    {message: 'Must be at least 3'}
);

// As a function that resolves to have the named prop
const d = min((context) => ({
    min: context.min,
    message: `Must be at least ${context.min}`
}));
```
