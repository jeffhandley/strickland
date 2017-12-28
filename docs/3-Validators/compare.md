# compare

The `compare` validator is quite similar to the `letter` validator we've built in our examples. In fact, it only has one additional feature. It accepts a function for the `compare` prop so that the compare value can be fetched at the time of validation even more easily than providing it as a validation-time prop. Of course, the comparison value can still be provided to either the validator factory or the validation context.

## Parameters

* `compare`: The value to compare against

## Result Properties

* `compare`: The value that was compared against

## Usage

The following code illustrates all the ways the comparison value can be supplied.

``` jsx
import validate, {compare} from 'strickland';

// As the first parameter to the factory
const a = compare('A', {message: 'Must be the letter A'});

// Within the context passed to the factory
const b = compare({compare: 'B', message: 'Must be the letter B'});

// As a function for the first parameter to the factory
const c = compare(() => 'C', {message: 'Must match C'});

// As a function on the context passed to the factory
const d = compare({compare: () => 'D', message: 'Must match D'});

// As a value on the validation context
const e = validate(compare(), 'Z', {
    compare: 'E',
    message: 'Must be the letter E'
});

// As a function on the validation context
const f = validate(compare(), 'Z', {
    compare: () => 'F',
    message: 'Must match F'
});
```
