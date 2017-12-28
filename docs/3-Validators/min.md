# min

The `min` validator checks that a value is at least the minimum value provided.

## Parameters

* `min`: The minimum value to compare against

## Result Properties

* `min`: The minimum value that was compared against

## Usage

The following code illustrates all the ways the minimum value can be supplied.

``` jsx
import validate, {min} from 'strickland';

// As the first parameter to the factory
const a = min(1, {message: 'Must be at least 1'});

// Within the context passed to the factory
const b = min({min: 2, message: 'Must be at least 2'});

// As a function for the first parameter to the factory
const c = min(() => 3, {message: 'Must be at least 3'});

// As a function on the context passed to the factory
const d = min({min: () => 4, message: 'Must be at least 4'});

// As a value on the validation context
const e = validate(min(), 100, {
    min: 5,
    message: 'Must be at least 5'
});

// As a function on the validation context
const f = validate(min(), 100, {
    min: () => 6,
    message: 'Must be at least 6'
});
```
