# Introduction

There are three core concepts you need to know with Strickland:

1. **Validators** - Implementations of your validation rules
2. **Validation** - The act of executing a validator against a value
3. **Validation Results** - The output of validation for the given validator and value

## Creating a Validator

A **validator** is a pure function that *accepts a value* and *returns a validation result*. Here is an extremely simple validator that validates that the value supplied is the letter 'A'.

``` jsx
function letterA(value) {
    return (value === 'A');
}
```

## Perfoming Validation

Strickland's default export is a `validate` function that accepts a validator function and the value to validate against the validator; it returns the validation result.

``` jsx
import validate from 'strickland';

function letterA(value) {
    return (value === 'A');
}

const result = validate(letterA, 'B');

/*
result = {
    isValid: false,
    value: 'B'
}
*/
```

## Validation Results

Strickland normalizes validation results to always be objects with `isValid` and `value` properties.

If the validator returns a falsy value, then `isValid` will be `false`. If the validator returns `true`, then `isValid` will be `true`. If the validator returns an object, the truthiness of its `isValid` property will be used on the result's `isValid` property.

The `value` on the validation result will always be the value that was validated.
