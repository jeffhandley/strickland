# maxLength

The `maxLength` validator checks that a value has a length no more than the maximum length provided.

## Parameters

* `maxLength`: The maximum length to compare against

## Result Properties

* `maxLength`: The maximum length that was compared against

## Usage

The following code illustrates all the ways the maximum length can be supplied.

``` jsx
import validate, {maxLength} from 'strickland';

// As the first parameter to the factory
const a = maxLength(1, {
    message: 'Must have a length of no more than 1'
});

// Within the context passed to the factory
const b = maxLength({
    maxLength: 2,
    message: 'Must have a length of no more than 2'
});

// As a function for the first parameter to the factory
const c = maxLength(() => 3, {
    message: 'Must have a length of no more than 3'
});

// As a function on the context passed to the factory
const d = maxLength({
    maxLength: () => 4,
    message: 'Must have a length of no more than 4'
});

// As a value on the validation context
const e = validate(maxLength(), 100, {
    maxLength: 5,
    message: 'Must have a length of no more than 5'
});

// As a function on the validation context
const f = validate(maxLength(), 100, {
    maxLength: () => 6,
    message: 'Must have a length of no more than 6'
});
```
