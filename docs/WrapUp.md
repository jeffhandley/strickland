# Wrap-Up

The design and implementation of Strickland ends up being fractal, with extensibility and composability available at every turn. Because validator functions are so simple, Strickland is a great framework on which you can build the validator libraries you need for your applications. And since Strickland is pure JavaScript and not coupled to any other libraries or concepts, it can be used in any JavaScript application.

Using Strickland's built-in validators, and its extensibility and composability, you can build your application's validation library and provide rich validation experiences for your users.

## Core Concepts

1. **[Validators](/docs/Introduction/Validators.md)** are implementations of your validation rules
1. **[Validation](/docs/Introduction/Validation.md)** is the act of executing a validator against a value
1. **[Validation Results](/docs/Introduction/ValidationResults.md)** are the output of validation for the given validator and value

## Extensibility Concepts

1. **[Validator Factories](/docs/Extensibility/ValidatorFactories.md)** are functions that take parameters and return validator functions
1. **[Validation Context](/docs/Extensibility/ValidationContext.md)** is provided to validators and returned on results
1. **[Validation Result Props](/docs/Extensibility/ValidationResultProps.md)** allow applications to produce rich user experiences

## Composition Concepts

1. **[Arrays of Validators](/docs/Composition/ArraysOfValidators.md)** can be composed together to validate a value against multiple validators
1. **[Validating Objects](/docs/Composition/ValidatingObjects.md)** is done by building objects that define how object props should be validated
1. **[Array and Object Conventions](/docs/Composition/Conventions.md)** enable terse and natural definitions of complex compositions
1. **[Form Validation](/docs/Composition/form.md)** is simplified with a built-in form validator that supports incremental, field-by-field validation

## Async Validation

1. **[Validators Can Use Promises](/docs/Async/README.md)** to provide async validation capabilities
1. **[Composition Supports Promises](/docs/Async/ValidatorArraysAndObjects.md)** within arrays of validators or object validation
1. **[Two-Stage Sync/Async Validation](/docs/Async/TwoStageValidation.md)** is conducted using the `validateAsync` validation result property

## Feedback

If you're interested in Strickland and have any feedback, please reach out in one of the following ways:

1. Submit issues on [GitHub](https://github.com/jeffhandley/strickland/issues)
1. Tweet to [@JeffHandley](https://twitter.com/JeffHandley)
