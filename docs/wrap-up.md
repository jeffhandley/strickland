# Wrap-Up

The design and implementation of Strickland ends up being fractal, with extensibility and composability available at every turn. Because validator functions are so simple, Strickland is a great framework on which you can build the validator libraries you need for your applications. And since Strickland is pure JavaScript and not coupled to any other libraries or concepts, it can be used in any JavaScript application.

Using Strickland's built-in validators, and its extensibility and composability, you can build your application's validation library and provide rich validation experiences for your users.

## Core Concepts

1. [**Validators**](introduction/validators.md) are implementations of your validation rules
2. [**Validation**](introduction/validation.md) is the act of executing a validator against a value
3. [**Validation Results**](introduction/validation-results.md) are the output of validation for the given validator and value

## Extensibility Concepts

1. [**Validator Factories**](extensibility/validator-factories.md) are functions that take parameters and return validator functions
2. [**Validation Context**](extensibility/validation-context.md) is provided to validators allowing application state to influence validation logic
3. [**Validation Result Props**](extensibility/validation-result-props.md) allow applications to produce rich user experiences

## Composition Concepts

1. [**Arrays of Validators**](composition/arrays-of-validators/) can be used to validate a value against multiple validators
2. \*\*\*\*[**Validating Array Elements**](composition/validating-array-elements/) is easily done using the arrayElements validator
3. [**Validating Objects**](composition/validating-objects/) is accomplished by building objects that define how the props should be validated
4. [**Composition Conventions**](composition/array-and-object-conventions.md) enable terse and natural definitions of complex compositions

## Async Validation

1. [**Validators Can Use Promises**](async-validation/) to provide async validation capabilities
2. [**Composition Supports Promises**](async-validation/async-validator-arrays-and-objects.md) within arrays of validators, array elements, and object validation
3. [**Two-Stage Sync/Async Validation**](async-validation/two-stage-sync-async-validation.md) is conducted using the `validateAsync` function

## Form Validation

1. [**Form Validation**](form-validation/) supports interactive field-level or form-level validation

## Feedback

If you're interested in Strickland and have any feedback, please reach out in one of the following ways:

1. Submit issues on [GitHub](https://github.com/jeffhandley/strickland/issues)
2. Tweet to [@JeffHandley](https://twitter.com/JeffHandley)

