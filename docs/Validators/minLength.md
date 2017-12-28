# minLength

The `minLength` validator checks that a value has a length at least the minimum length provided.

## Parameters

* `minLength`: The minimum length to compare against

## Result Properties

* `minLength`: The minimum length that was compared against

## Usage

The following code illustrates all the ways the minimum length can be supplied.

``` jsx
import validate, {minLength} from 'strickland';

// As the first parameter to the factory
const a = minLength(1, {
    message: 'Must have a length of at least 1'
});

// Within the context passed to the factory
const b = minLength({
    minLength: 2,
    message: 'Must have a length of at least 2'
});

// As a function for the first parameter to the factory
const c = minLength(() => 3, {
    message: 'Must have a length of at least 3'
});

// As a function on the context passed to the factory
const d = minLength({
    minLength: () => 4,
    message: 'Must have a length of at least 4'
});

// As a value on the validation context
const e = validate(minLength(), 100, {
    minLength: 5,
    message: 'Must have a length of at least 5'
});

// As a function on the validation context
const f = validate(minLength(), 100, {
    minLength: () => 6,
    message: 'Must have a length of at least 6'
});
```
