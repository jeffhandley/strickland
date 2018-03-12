# <a href="http://strickland.io"><img src="https://raw.githubusercontent.com/jeffhandley/strickland/f73c6bbb370210d0dc5119f0fac96aa29dc52b22/logo/strickland.png" height="60" alt="Strickland logo" aria-label="Strickland.io website" border="0" /></a>

Strickland is a JavaScript validation _framework_ with a focus on extensibility and composability. It is built with pure, universal JavaScript and while it works well with React, Redux, and other UI libraries, Strickland is not coupled to any other library or application type.

Strickland is a unique and robust approach to building validation into your application.

* It is *not* a type system and it does not interfere with how you create and manage objects
* Instead, validation rules are defined separately from the data
* While Strickland can be used within the UI layer (including React components or Redux modules), it is not limited to use within UI
* Universal applications can share validators across both client-side and server-side validation
* With its extensibility and composability, Strickland supports complex scenarios in large line-of-business applications

Strickland focuses not on being a bloated collection of validators, but instead on enabling you to create your application's collection of validators and compose them together easily.

## Core Concepts

There are three core concepts you need to know with Strickland:

1. **Validators** are implementations of your validation rules
2. **Validation** is the act of executing a validator against a value
3. **Validation Results** are the output of validation for the given validator and value

### Creating Validators

Strickland **validators** are pure functions that *accept values* and *return validation results*. Here is an extremely simple validator that validates that the value supplied is the letter 'A', returning the validation result as a boolean.

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
```

### Validation Results

Strickland normalizes validation results to always be objects with `isValid` and `value` properties.

If the validator returns a falsy value, then `isValid` will be `false`. If the validator returns `true`, then `isValid` will be `true`. If the validator returns an object, the truthiness of its `isValid` property will be used on the result's `isValid` property.

The `value` on the validation result will always be the value that was validated.

``` jsx
import validate from 'strickland';

function letterA(value) {
    // We can return a validation result as a boolean
    return (value === 'A');

    // Or as an object
    // return {
    //    isValid: (value === 'A')
    // };
}

const result = validate(letterA, 'B');

// Either way, the result will match:
//
// result = {
//     isValid: false,
//     value: 'B'
// }
```

## Documentation

* [Introduction](http://strickland.io/docs/Introduction/index.html)
    * [Creating Validators](http://strickland.io/docs/Introduction/Validators.html)
    * [Performing Validation](http://strickland.io/docs/Introduction/Validation.html)
    * [Validation Results](http://strickland.io/docs/Introduction/ValidationResults.html)
* [Extensibility](http://strickland.io/docs/Extensibility/index.html)
    * [Validator Factories](http://strickland.io/docs/Extensibility/ValidatorFactories.html)
    * [Validation Context](http://strickland.io/docs/Extensibility/ValidationContext.html)
    * [Validation Result Props](http://strickland.io/docs/Extensibility/ValidationResultProps.html)
    * [Extensibility Pattern](http://strickland.io/docs/Extensibility/Pattern.html)
* [Built-In Validators](http://strickland.io/docs/Validators/index.html)
    * [required](http://strickland.io/docs/Validators/required.html)
    * [compare](http://strickland.io/docs/Validators/compare.html)
    * [min](http://strickland.io/docs/Validators/min.html)
    * [max](http://strickland.io/docs/Validators/max.html)
    * [range](http://strickland.io/docs/Validators/range.html)
    * [minLength](http://strickland.io/docs/Validators/minLength.html)
    * [maxLength](http://strickland.io/docs/Validators/maxLength.html)
    * [length](http://strickland.io/docs/Validators/length.html)
* [Composition](http://strickland.io/docs/Composition/index.html)
    * [Arrays of Validators](http://strickland.io/docs/Composition/ArraysOfValidators.html)
        * [every](http://strickland.io/docs/Composition/every.html)
        * [each](http://strickland.io/docs/Composition/each.html)
        * [some](http://strickland.io/docs/Composition/some.html)
    * [Validating Objects](http://strickland.io/docs/Composition/ValidatingObjects.html)
        * [objectProps](http://strickland.io/docs/Composition/objectProps.html)
        * [Advanced Object Validation](http://strickland.io/docs/Composition/AdvancedObjectValidationhtmld)
        * [Nested Objects](http://strickland.io/docs/Composition/NestedObjects.html)
    * [Array and Object Conventions](http://strickland.io/docs/Composition/Conventions.html)
* [Async Validation](http://strickland.io/docs/Async/index.html)
    * [Resolving Async Validation](http://strickland.io/docs/Async/ResolvingAsyncValidation.html)
    * [Deferred Async Validation](http://strickland.io/docs/Async/DeferredAsyncValidation.html)
    * [Async Validator Arrays and Objects](http://strickland.io/docs/Async/ValidatorArraysAndObjects.html)
    * [Two-Stage Sync/Async Validation](http://strickland.io/docs/Async/TwoStageValidation.html)
    * [Race Conditions](http://strickland.io/docs/Async/RaceConditions.html)
* [Form Validation](http://strickland.io/docs/Forms/index.html)
    * [form](http://strickland.io/docs/Forms/form.html)
* [Wrap-Up](http://strickland.io/docs/WrapUp.html)
* [Change Log](http://strickland.io/docs/CHANGELOG.html)

## License

MIT
