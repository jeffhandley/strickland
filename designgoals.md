# Design Goals

With the validation problem space well understood, Strickland sets out to achieve many challenging design goals.

1. Remain decoupled from the UI
2. Take no dependencies on other libraries
3. Utilize plain old JavaScript objects and values
4. Apply universal, functional JavaScript patterns
5. Supply only primitive built-in validators
6. Enable consumers to easily create their own validators
7. Provide simple composition features for complex validation logic
8. Maintain a low concept count
9. Permit both synchronous and asynchronous validators
10. Support any possible interaction model
11. Allow boundless extensibility for any application scenario

## Decoupled from the UI

Strickland is built with pure JavaScript. There are no features or concepts coupled to any UI libraries or any rendering concepts at all. Strickland can work just as well for a RESTful API service as it can for a web application with large UI forms.

With this model, Strickland validation can be reused across the server and client. If you have a Node backend and a JavaScript frontend, you can build your validation rules into a shared package.

## No Dependencies

Strickland does not have any dependencies on other libraries.

## Plain Old JavaScript Objects

Strickland is not a type system that forces you to construct and manipulate your data unnaturally. Instead, Strickland works with plain old JavaScript objects and values.

## Universal, Functional JavaScript

Strickland can be executed in any JavaScript environment including the browser and Node. Many functional programming patterns are applied throughout Strickland to yield a friendly yet flexible API. Strickland is also entirely stateless, ensuring your application's architecture is not compromised.

## Primitive Built-In Validators

Strickland does not aim to be a bloated collection of validators. Only the most primitive validators are built-in so that Strickland remains a lightweight framework.

## Ease of Validator Creation

Strickland makes it easy to create your own validators. A single-line arrow function can be used to start, but the programming model scales with your application. As your validators become more complex, Strickland gives you the flexibility you need.

## Composition is Critical

Strickland provides features to compose your validators together. As your collection of validators grows, you will be able to reuse them throughout your applications without any friction.

## Low Concept Count

Strickland is powerful yet its concept count remains very low. Validators define rules; validation executes validators against values; validation results are returned.

## Synchronous and Asynchronous Validation

Strickland lets you quite simply introduce asynchronous validation into your application, without having to drastically change your programming model or alter how synchronous validation is performed.

## Any Interaction Model

Strickland is unaware of how your users are interacting with your system. Because Strickland is completely stateless, you can invoke validation whenever and however you'd like. You can invoke UI form validation on keypress, after an idle timeout, on field blur, on form submit, or any combination of these events. You can build server-side validation using the same validator code and execution patterns.

## Boundless Extensibility

A validator can easily execute other validators, which is demonstrated with arrays of validators and object validation.

Dynamic validators can be created using validator factories.

Validators can receive props using objects or functions that return objects. Those functions can receive validation-time context so that application state can be used within validation rules.

Validators can return booleans, objects, Promises that resolve to booleans or objects, or functions that return Promises that resolve to booleans or objects. Strickland normalizes all of these into consistent and predictable validation results.

Your application is responsible for providing all of the validation result properties, even validation messages. This approach ensures that your application can extend Strickland to meet any functional requirements. Localized messages, warning-level validation results, async progress indicators, UI rendering hints, or any other functionality specific to your platform or application can be applied as a first-class feature.

