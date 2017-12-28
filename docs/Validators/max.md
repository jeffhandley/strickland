# Built-In Validator: max

The `max` validator checks that a value is at most the maximum value provided.

## Parameters

* `max`: The maximum value to compare against

## Result Properties

* `max`: The maximum value that was compared against

## Usage

The following code illustrates all the ways the maximum value can be supplied.

``` jsx
import validate, {max} from 'strickland';

// As the first parameter to the factory
const a = max(1, {message: 'Must be at most 1'});

// Within the context passed to the factory
const b = max({max: 2, message: 'Must be at most 2'});

// As a function for the first parameter to the factory
const c = max(() => 3, {message: 'Must be at most 3'});

// As a function on the context passed to the factory
const d = max({max: () => 4, message: 'Must be at most 4'});

// As a value on the validation context
const e = validate(max(), 100, {
    max: 5,
    message: 'Must be at most 5'
});

// As a function on the validation context
const f = validate(max(), 100, {
    max: () => 6,
    message: 'Must be at most 6'
});
```
