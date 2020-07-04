# Extensibility

Strickland is _not_ a bloated collection of validators. Instead, Strickland is an _extensible framework_ on which you can build your application's validation. To achieve the extensibility goal, Strickland keeps its core concepts at a minimum and provides you with the power to extend the concepts as needed in your application.

## Areas of Extensibility

We learned that Strickland is made up of three core concepts: Validators, Validation, and Validation Results. All three of these concepts are extensible.

* [Validator Factories](validator-factories.md)
* [Validation Context](validation-context.md)
* [Validation Result Props](validation-result-props.md)

## Extensibility Pattern

With validator factories, validation context, and validation result props, even the simplest validators can become extremely extensible. When combining these features, [an extensibility pattern](extensibility/extensibility-pattern.md) emerges.
