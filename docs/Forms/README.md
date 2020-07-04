# Form Validation

Let's face it: we're trying to validate forms in the user interface. Yes, Strickland is decoupled from the UI and it _can_ be used in other scenarios \(like APIs\), but form validation is the primary use case.

With the ability to validate an entire object with the `objectProps` validator, Strickland gets pretty close to providing form validation; it just falls short in one key way. The `objectProps` validator does not support validating field-by-field. You can dynamically build your `objectProps` validator to target specific fields and merge validation results after each validation, but there's a lot of orchestration code involved.

To simplify this scenario, Strickland provides a `form` validator that behaves similarly to `objectProps`, but it has additional features for field-by-field validation where a form's validation results are built up incrementally.

