# Composition

The examples we've seen so far only validate single values against single validators. But Strickland gains the bulk of its power through composition of validators. Because every validator is simply a function, it is easy to create a function that executes multiple validators. Validators themselves can invoke the `validate` function to collect results of multiple validators and combine them together into top-level validation results.

* [Arrays of Validators](ArraysOfValidators.md)
    * [every](every.md)
    * [each](each.md)
    * [some](some.md)
* [Validating Objects](ValidatingObjects.md)
    * [With the objectProps Validator](objectProps.md)
    * [Advanced Object Validation](AdvancedObjectValidation.md)
    * [Nested Objects](NestedObjects.md)
* [Array and Object Conventions](Conventions.md)
