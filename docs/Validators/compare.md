# Built-In Validator: compare

The `compare` validator is quite similar to the letter validator we've built in our examples. In fact, it only has one additional behavior. If the value being validated is `null`, `false`, an empty string, or another falsy value other than `0`, then the result will be valid. This respects the rule of thumb described in the notes for the [required](./required.md) validator.

## Named Props

* `compare`: The value compared against
    * If the parameter supplied is not an object, it will be used as the `compare` named prop

## Usage

``` jsx
import validate, {compare} from 'strickland';

// Using a non-object param to specify the compare value
const letterA = compare('A');

// Using a named prop
const letterB = compare({
    compare: 'B',
    message: 'Must be the letter "B"'
});

// Using a function that resolves to specify the compare value
const letterValidatorA = compare((context) => context.compare);

// Using a function that resolves to have the named prop
const letterValidatorB = compare((context) => ({
    compare: context.compare,
    message: `Must match "${context.compare}"`
}));
```
