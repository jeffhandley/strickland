# Composition

The examples we've seen so far only validate single values against single validators. But Strickland gains the bulk of its power through composition of validators. Because every validator is simply a function, it is easy to create a function that executes multiple validators. Validators themselves can invoke the `validate` function to collect results of multiple validators and combine them together into top-level validation results.

* [Arrays of Validators](arraysofvalidators/)
  * [every](arraysofvalidators/every.md)
  * [all](arraysofvalidators/all.md)
  * [some](arraysofvalidators/some.md)
* [Validating Objects](validatingobjects/)
  * [With the objectProps Validator](validatingobjects/objectprops.md)
  * [Advanced Object Validation](validatingobjects/advancedobjectvalidation.md)
  * [Nested Objects](validatingobjects/nestedobjects.md)
* [Array and Object Conventions](conventions.md)

