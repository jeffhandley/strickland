# Composition

The examples we've seen so far only validate single values against single validators. But Strickland gains the bulk of its power through composition of validators. Because every validator is simply a function, it is easy to create a function that executes multiple validators. Validators themselves can invoke the `validate` function to collect results of multiple validators and combine them together into top-level validation results.

* [Arrays of Validators](arrays-of-validators/)
  * [every](arrays-of-validators/every.md)
  * [all](arrays-of-validators/all.md)
  * [some](arrays-of-validators/some.md)
* [Validating Objects](validating-objects/)
  * [With the objectProps Validator](validating-objects/objectprops.md)
  * [Advanced Object Validation](validating-objects/advanced-object-validation.md)
  * [Nested Objects](validating-objects/nested-objects.md)
* [Array and Object Conventions](array-and-object-conventions.md)

