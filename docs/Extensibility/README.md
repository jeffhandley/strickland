# Extensibility

Strickland is *not* a bloated collection of validators. Instead, Strickland is an *extensible framework* on which you can build your application's validation. To achieve the extensibility goal, Strickland keeps its core concepts at a minimum and provides you with the power to extend the concepts as needed in your application.

## Areas of Extensibility

We learned that Strickland is made up of three core concepts: Validators, Validation, and Validation Results. All three of these concepts are extensible.

* [Validator Factories](ValidatorFactories.md)
* [Validation Context](ValidationContext.md)
* [Validation Result Props](ValidationResults.md)

## Extensibility Pattern

With validator factories, validation context, and validation result props, even the simplest validators can become extremely extensible. When combining these features, [an extensibility pattern](Pattern.md) emerges.

## Flexible Validator Factory Parameters

Strickland provides [flexible validator factory parameter handling](getValidatorProps.md). A `getValidatorProps` utility function is used to accomplish this, and that utility function is available for you to use in your validators too.
