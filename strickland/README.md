# Readme

Strickland is a JavaScript validation _framework_ with a focus on extensibility and composability. It is built with pure, universal JavaScript and while it works well with React, Redux, and other UI libraries, Strickland is not coupled to any other library or application type.

Strickland is a unique and robust approach to building validation into your application.

* It is _not_ a type system and it does not interfere with how you create and manage objects
* Instead, validation rules are defined separately from the data
* While Strickland can be used within the UI layer \(including React components or Redux modules\), it is not limited to use within UI
* Universal applications can share validators across both client-side and server-side validation
* With its extensibility and composability, Strickland supports complex scenarios in large line-of-business applications

Strickland focuses not on being a bloated collection of validators, but instead on enabling you to create your application's collection of validators and compose them together easily.

## Separation of Concerns

In any validation implementation, there are three separate concerns that you must address, regardless of the libraries used.

1. **Validation Rules** are the logic of how data is validated
2. **Validation Triggers** are the events that trigger validation to occur at the field or form level
3. **Validation Results** are presented to the user as the output of your validation rules

The most robust, flexible, and maintainable validation implementations keep these three concerns separated. Validation rules should not be coupled to the validation triggers or how the results will be presented. Validation triggers should not be coupled in any way to the validation rules or how the results will be presented. And the presentation of validation results should not be coupled to how validation was triggered or what the rules were.

With this separation of concerns in mind, Strickland strives to:

1. **Provide a flexible framework for authoring validation rules** so that many different types of validation rules can be authored while remaining decoupled from validation triggers and how validation results are displayed
2. **Be completely uninvolved in validation triggers** so that consuming applications can be built with any UI frameworks and without imposing any opinions on user interactions
3. **Provide a consistent structure for exposing validation results** so that they can be consumed by applications consistently regardless of how many or what types of validation rules are present

## Core Concepts

To address the core concepts above, there are three core concepts you need to know with Strickland:

1. **Validators** are implementations of your validation rules
2. **Validation** is the act of executing a validator against a value
3. **Validation Results** are the output of validation for the given validator and value

### Creating Validators

Strickland **validators** are pure functions that _accept values_ and _return validation results_. Here is an extremely simple validator that validates that the value supplied is the letter 'A', returning the validation result as a boolean.

```jsx
function letterA(value) {
    return (value === 'A');
}
```

### Performing Validation

Strickland's default export is a `validate` function that accepts a validator function and the value to validate against the validator; it returns the validation result.

```jsx
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

```jsx
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

* [Introduction](https://strickland.io/introduction/README.md)
  * [Creating Validators](https://strickland.io/introduction/creating-validators.md)
  * [Performing Validation](https://strickland.io/introduction/performing-validation.md)
  * [Validation Results](https://strickland.io/introduction/validation-results.md)
* [Extensibility](https://strickland.io/extensibility/README.md)
  * [Validator Factories](https://strickland.io/extensibility/validator-factories.md)
  * [Validation Context](https://strickland.io/extensibility/validation-context.md)
  * [Validation Result Props](https://strickland.io/extensibility/validation-result-props.md)
  * [Extensibility Pattern](https://strickland.io/extensibility/extensibility-pattern.md)
* [Built-In Validators](https://strickland.io/built-in-validators/README.md)
  * [required](https://strickland.io/built-in-validators/required.md)
  * [compare](https://strickland.io/built-in-validators/compare.md)
  * [min](https://strickland.io/built-in-validators/min.md)
  * [max](https://strickland.io/built-in-validators/max.md)
  * [range](https://strickland.io/built-in-validators/range.md)
  * [minLength](https://strickland.io/built-in-validators/minlength.md)
  * [maxLength](https://strickland.io/built-in-validators/maxlength.md)
  * [length](https://strickland.io/built-in-validators/length.md)
* [Composition](https://strickland.io/composition/README.md)
  * [Arrays of Validators](https://strickland.io/composition/arrays-of-validators/README.md)
    * [every](https://strickland.io/composition/arrays-of-validators/every.md)
    * [all](https://strickland.io/composition/arrays-of-validators/all.md)
    * [some](https://strickland.io/composition/arrays-of-validators/some.md)
  * [Validating Objects](https://strickland.io/composition/validating-objects/README.md)
    * [objectProps](https://strickland.io/composition/validating-objects/objectprops.md)
    * [Advanced Object Validation](https://strickland.io/composition/validating-objects/advanced-object-validation.md)
    * [Nested Objects](https://strickland.io/composition/validating-objects/nested-objects.md)
  * [Array and Object Conventions](https://strickland.io/composition/array-and-object-conventions.md)
* [Async Validation](https://strickland.io/async-validation/README.md)
  * [Resolving Async Validation](https://strickland.io/async-validation/resolving-async-validation.md)
  * [Deferred Async Validation](https://strickland.io/async-validation/deferred-async-validation.md)
  * [Async Validator Arrays and Objects](https://strickland.io/async-validation/async-validator-arrays-and-objects.md)
  * [Two-Stage Sync/Async Validation](https://strickland.io/async-validation/two-stage-sync-async-validation.md)
  * [Race Conditions](https://strickland.io/async-validation/race-conditions.md)
  * [Automatic Race Condition Handling](https://strickland.io/async-validation/automatic-race-condition-handling.md)
* [Form Validation](https://strickland.io/form-validation/README.md)
  * [form](https://strickland.io/form-validation/form.md)
  * [Async Form Validation](https://strickland.io/form-validation/async-form-validation.md)
  * [validateFields](https://strickland.io/form-validation/validatefields.md)
  * [emptyResults](https://strickland.io/form-validation/emptyresults.md)
  * [updateFieldResults](https://strickland.io/form-validation/updatefieldresults.md)
* [Inspiration](https://strickland.io/inspiration.md)
* [Design Goals](https://strickland.io/design-goals.md)
* [Wrap-Up](https://strickland.io/wrap-up.md)
* [Change Log](https://github.com/jeffhandley/strickland/blob/main/CHANGELOG.md)

## License

MIT
