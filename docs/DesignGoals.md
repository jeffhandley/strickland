# Design Goals

With the validation problem space well understood, Strickland sets out to achieve many challenging design goals.

1. Remain decoupled from the UI
1. Take no dependencies on other libraries
1. Utilize plain old JavaScript objects and values
1. Apply universal, functional JavaScript patterns
1. Supply only the most primitive built-in validators
1. Enable consumers to easily create their own validators
1. Provide simple composition features for complex validation logic
1. Maintain a low concept count
1. Permit both synchronous and asynchronous validators
1. Support any possible interaction model
1. Allow boundless extensibility for any application scenarios

## Decoupled from the UI

Strickland is built with pure JavaScript. There are no features or concepts coupled to any UI libraries or any rendering concepts at all. Strickland can work just as well for a RESTful API service as it can for a web application with large UI forms.

With this model, Strickland validation can be reused across the server and client. If you have a Node backend and a JavaScript frontend, you can build your validation rules into a package shared across them both.

## No Dependencies

Strickland does not have any dependencies on other libraries.

## Plain Old JavaScript Objects

Strickland is not a type system that forces you to construct and manipulate your values and objects unnaturally. Instead, Strickland works with plain old JavaScript objects and values.

## Universal, Functional JavaScript

Strickland can be used in the browser or in Node and it can be executed in any JavaScript environment. Many functional programming patterns are applied throughout Strickland to yield a friendly yet flexible API. Strickland is also entirely stateless, ensuring your application's architecture is not compromised.

## Primitive Built-In Validators

Strickland does not aim to be a bloated collection of validators. Only the most primitive validators are built-in so that Strickland remains light weight and easy to use.

## Ease of Validator Creation

Strickland makes it easy to create your own validators. A single-line arrow function can be used to start, but the programming models scales with your needs. As your validators become more complex, Strickland gives you the flexibility you need.

## Composition is Critical

Strickland provides features to compose your validators together. As your collection of validator functions grows, you will be able to reuse them throughout your applications without any friction.

## Low Concept Count

Strickland is very powerful yet its core concept count remains very low. Validators define rules; validation executes validators against values; validation results are the output.

## Synchronous and Asynchronous Validation

Strickland lets you very simply introduce asynchronous validation into your application, without having to drastically change your programming model or alter how synchronous validation is performed.

## Any Interaction Model

Strickland is unaware of how your users are interacting with your system. Because Strickland is completely stateless, you can invoke Strickland whenever and however you'd like. You can build UI form validation where validation occurs on keypress, after an idle timeout, on field blur, on form submit, or any combination of these events. You can build server-side validation using the same validator code and execution patterns.

## Boundless Extensibility

A validator can easily execute other validators, which is demonstrated with arrays of validators and object validation.

Dynamic validators can be created using validator factories.

Validators can receive props using objects or functions that return objects. Those functions can receive validation-time context so that application state can be used within validation rules.

Validation results can be booleans, objects, Promises that resolve to booleans or objects, or functions that return Promises that resolve to booleans or objects.

Your application is responsible for providing even validation messages, but this approach ensures that your application can extend Strickland to meet any functional requirements. Localized messages, warning-level validation results, async progress indicators, UI rendering hints, or any other functionality specific to your platform or application can be applied as a first-class feature.

