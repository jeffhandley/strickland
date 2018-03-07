# Form Validation

Let's face it: we're trying to validate forms in the user interface. Yes, Strickland is decoupled from the UI and it _can_ be used in other scenarios (like APIs), but form validation is the primary use case.

With the `props` validator, Strickland gets pretty close to providing form validation; it just falls short in one key way. The `props` validator is great if the entire form is being validated in one shot, but it doesn't support validating field-by-field. You can certainly build a `props` validator object and conditionally pluck props off of it and dynamically build your `props` validator. It works; it's just a lot of work.

To simplify this scenario, Strickland provides a `form` validator that behaves similarly to `props`, but it has additional features for field-by-field validation where a form's validation results are built up incrementally.
