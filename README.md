# Strickland

Strickland is a JavaScript validation _framework_ with a focus on extensibility and composability. It built with pure, universal JavaScript and while it works well with React, Redux, or other libraries, Strickland is not coupled to any other library or application type.

Strickland is a unique and robust approach to building validation into your application.

* It is *not* a type system and it does not interfere with how you create and manage data
* Instead, validation rules are defined separately from the data
* While Strickland can be used within the UI layer (including React components or Redux modules), it is not limited to use within UI
* Universal applications can share validators across both client-side and server-side validation
* With its extensibility and composability, Strickland supports complex scenarios in large line-of-business applications

Strickland focuses not on being a bloated collection of validators, but instead on enabling you to create your own collection of validators that can be composed together easily.

## Core Concepts

There are three core concepts you need to know with Strickland:

1. **Validators** - Implementations of your validation rules
2. **Validation** - The act of executing a validator against a value
3. **Validation Results** - The output of validation for the given validator and value

### Creating Validators

Strickland **validators** are pure functions that *accept values* and *return validation results*. Here is an extremely simple validator that validates that the value supplied is the letter 'A'.

``` jsx
function letterA(value) {
    return (value === 'A');
}
```

### Perfoming Validation

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

### Validation Results

Strickland normalizes validation results to always be objects with `isValid` and `value` properties.

If the validator returns a falsy value, then `isValid` will be `false`. If the validator returns `true`, then `isValid` will be `true`. If the validator returns an object, the truthiness of its `isValid` property will be used on the result's `isValid` property.

The `value` on the validation result will always be the value that was validated.

## Documentation

* [Introduction](/docs/Introduction/README.md)
    * [Creating Validators](/docs/Introduction/Validators.md)
    * [Performing Validation](/docs/Introduction/Validation.md)
    * [Validation Results](/docs/Introduction/ValidationResults.md)
* [Extensibility](/docs/Extensibility/README.md)
    * [Validator Factories](/docs/Extensibility/ValidatorFactories.md)
    * [Validation Context](/docs/Extensibility/ValidationContext.md)
    * [Extensible Validation Results](/docs/Extensibility/ValidationResults.md)
    * [Extensibility Pattern](/docs/Extensibility/Pattern.md)
* [Built-In Validators](/docs/Validators/README.md)
    * [compare](/docs/Validators/compare.md)
    * [min](/docs/Validators/min.md)
    * [max](/docs/Validators/max.md)
    * [range](/docs/Validators/range.md)
    * [minLength](/docs/Validators/minLength.md)
    * [maxLength](/docs/Validators/maxLength.md)
    * [length](/docs/Validators/length.md)
    * [required](/docs/Validators/required.md)
* [Composition](/docs/Composition/README.md)
    * [Arrays of Validators](/docs/Composition/ArraysOfValidators.md)
        * [every](/docs/Composition/every.md)
        * [each](/docs/Composition/each.md)
        * [some](/docs/Composition/some.md)
    * [Validating Objects](/docs/Composition/ValidatingObjects.md)
        * [props](/docs/Composition/props.md)
* [Async Validation](/docs/Async/README.md)
    * [Async Validator Arrays and Objects](/docs/Async/ValidatorArraysAndObjects.md)
    * [Two-Stage Sync/Async Validation](/docs/Async/TwoStageValidation.md)
* [Wrap-Up](/docs/WrapUp.md)

## License

MIT
