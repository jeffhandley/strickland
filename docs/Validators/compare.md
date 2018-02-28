# Built-In Validator: compare

The `compare` validator is quite similar to the `letter` validator we've built in our examples. In fact, it only has one additional behavior. If the value being validated is `null`, `false`, an empty string, or another falsy value other than `0`, then the result will always be valid. This respects the rule of thumb described in the notes for the [required](./required.md) validator.

## Named Props

* `compare`: The value compared against

## Usage

The following code illustrates all the ways the comparison value can be supplied.

``` jsx
import validate, {compare} from 'strickland';

// As the first parameter to the factory
const a = compare('A', {
    message: 'Must be the letter "A"'
});

// As a named prop
const b = compare({
    compare: 'B',
    message: 'Must be the letter "B"'
});

// As a function that resolves to the comparison value
const c = compare(
    (context) => 'C',
    {message: 'Must match C'}
);

// As a function that resolves to have the named prop
const d = compare((context) => ({
    compare: context.compare,
    message: `Must match "${context.compare}"`
}));
```
