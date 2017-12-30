# Extensibility

Strickland is *not* a bloated collection of validators. Instead, Strickland is an *extensible framework* on which you can build your application's validation. To achieve the extensibility goal, Strickland keeps its core concepts at a minimum and provides you with the power to extend the concepts as needed in your application.

## Areas of Extensibility

We learned that Strickland is made up of three core concepts: Validators, Validation, and Validation Results. All three of these concepts are extensible.

* [Validator Factories](ValidatorFactories.md)
* [Validation Context](ValidationContext.md)
* [Extensible Validation Results](ValidationResults.md)

## Extensibility Pattern

With validator factories, validation context, and extensible validation results, even the simplest validators can become extremely extensible. When combining these features, [an extensibility pattern](Pattern.md) emerges.
