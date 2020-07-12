# Extensibility

Strickland is _not_ a bloated collection of validators. Instead, Strickland is an _extensible framework_ on which you can build validators that empower rich application validation experiences. To achieve the extensibility goal, Strickland promotes creating extensible validators with prescribed extensibility patterns.

## Creating Extensible Validators

We learned that Strickland is made up of three core concepts: **Validators**, **Validation**, and **Validation Results**. Strickland prescribes patterns for creating validators that allow all three of those concepts to be extensible.

### Validator Factories

Validators often need to be parameterized, accepting validator props to be used within the validation logic. [Validator Factories](validator-factories.md) can be used to accept these parameters to be used during validation.

Validator Factories are simply functions that accept validator props and return validator functions. Nothing else is needed, so there is no intrinsic awareness of Validator Factories within Strickland.

Validators that accept validator props through validation factories should include those specified props on the validation result, thus allowing consumers of the validation results to have visibility into the prop values that controlled the validation logic.

### Validation Context

Sometimes validator prop values will not be known when declaring a validator, and instead will only be known at the time of performing validation. Validator functions can argument a [Validation Context](validation-context.md) argument and use the it to extend the validator props passed into Validator Factories.

Strickland's `validate` function accepts this validation context and passes it to the validator function.

### Validation Result Props

We saw that validators can return very simple results, even just using `Boolean` values. Validators can also return result objects with other props, and validator props should be included on validation results. But it's also common for an application to need to enrich validation results with other props that aren't needed by the validation logic itself--validation messages are a common example.

To make this simple, validators can accept arbitrary props and include them as [Validation Result Props](validation-result-props.md). This practice is merely an extension of including validator props on validation results, but spreading all of the validator props onto the result.

### Extensibility Pattern

With validator factories, validation context, and validation result props, even the simplest validators can become extremely extensible. An [extensibility pattern](extensibility-pattern.md) emerges when all three of these extensibility practices are combined together in validators.

## Extending Validation Results

Applications can gain rich experiences when validators employ these extensibility patterns. But sometimes applications need to extend validation results in ways that are not supported by the validators themselves.

1. If any validators do not support Validation Result Props
2. If any validation result props need to be calculated based on other result props

Strickland provides a [`formatResult`](formatresult.md) validator wrapper that can be used to extend validation results from outside the validator itself. Result formatters have access to the validator's result and can augment or transform validation results.

