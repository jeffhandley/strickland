# Built-In Validator: compare

The `compare` validator is quite similar to the letter validator we've built in our examples. In fact, it only has one additional behavior. If the value being validated is `null`, `false`, an empty string, or another falsy value other than `0`, then the result will be valid. This respects the rule of thumb described in the notes for the [required](./required.md) validator.

## Named Props

* `compare`: The value compared against

## Usage

``` jsx
import validate, {compare} from 'strickland';

// Using a named prop
const letterA = compare({
    compare: 'a',
    message: 'Must be the letter "A"'
});

// Using a function that resolves to have the named prop
const letterValidator = compare((context) => ({
    compare: context.compare,
    message: `Must match "${context.compare}"`
}));
```
