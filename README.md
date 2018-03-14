# <a href="https://strickland.io"><img src="https://raw.githubusercontent.com/jeffhandley/strickland/f73c6bbb370210d0dc5119f0fac96aa29dc52b22/logo/strickland.png" height="60" alt="Strickland logo" aria-label="Strickland.io website" border="0" /></a>

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

* [Introduction](https://strickland.io/docs/Introduction/index.html)
    * [Creating Validators](https://strickland.io/docs/Introduction/Validators.html)
    * [Performing Validation](https://strickland.io/docs/Introduction/Validation.html)
    * [Validation Results](https://strickland.io/docs/Introduction/ValidationResults.html)
* [Extensibility](https://strickland.io/docs/Extensibility/index.html)
    * [Validator Factories](https://strickland.io/docs/Extensibility/ValidatorFactories.html)
    * [Validation Context](https://strickland.io/docs/Extensibility/ValidationContext.html)
    * [Validation Result Props](https://strickland.io/docs/Extensibility/ValidationResultProps.html)
    * [Extensibility Pattern](https://strickland.io/docs/Extensibility/Pattern.html)
* [Built-In Validators](https://strickland.io/docs/Validators/index.html)
    * [required](https://strickland.io/docs/Validators/required.html)
    * [compare](https://strickland.io/docs/Validators/compare.html)
    * [min](https://strickland.io/docs/Validators/min.html)
    * [max](https://strickland.io/docs/Validators/max.html)
    * [range](https://strickland.io/docs/Validators/range.html)
    * [minLength](https://strickland.io/docs/Validators/minLength.html)
    * [maxLength](https://strickland.io/docs/Validators/maxLength.html)
    * [length](https://strickland.io/docs/Validators/length.html)
* [Composition](https://strickland.io/docs/Composition/index.html)
    * [Arrays of Validators](https://strickland.io/docs/Composition/ArraysOfValidators.html)
        * [every](https://strickland.io/docs/Composition/every.html)
        * [each](https://strickland.io/docs/Composition/each.html)
        * [some](https://strickland.io/docs/Composition/some.html)
    * [Validating Objects](https://strickland.io/docs/Composition/ValidatingObjects.html)
        * [objectProps](https://strickland.io/docs/Composition/objectProps.html)
        * [Advanced Object Validation](https://strickland.io/docs/Composition/AdvancedObjectValidation.html)
        * [Nested Objects](https://strickland.io/docs/Composition/NestedObjects.html)
    * [Array and Object Conventions](https://strickland.io/docs/Composition/Conventions.html)
* [Async Validation](https://strickland.io/docs/Async/index.html)
    * [Resolving Async Validation](https://strickland.io/docs/Async/ResolvingAsyncValidation.html)
    * [Deferred Async Validation](https://strickland.io/docs/Async/DeferredAsyncValidation.html)
    * [Async Validator Arrays and Objects](https://strickland.io/docs/Async/ValidatorArraysAndObjects.html)
    * [Two-Stage Sync/Async Validation](https://strickland.io/docs/Async/TwoStageValidation.html)
    * [Race Conditions](https://strickland.io/docs/Async/RaceConditions.html)
    * [Automatic Race Condition Handling](https://strickland.io/docs/Async/AutomaticRaceConditionHandling.html)
* [Form Validation](https://strickland.io/docs/Forms/index.html)
    * [form](https://strickland.io/docs/Forms/form.html)
    * [Async Form Validation](https://strickland.io/docs/Forms/AsyncFormValidation.md)
    * [validateFields](https://strickland.io/docs/Forms/validateFields.html)
    * [emptyResults](https://strickland.io/docs/Forms/emptyResults.html)
    * [updateFieldResults](https://strickland.io/docs/Forms/updateFieldResults.html)
* [Wrap-Up](https://strickland.io/docs/WrapUp.html)
* [Change Log](https://strickland.io/docs/CHANGELOG.html)

## License

MIT
