# Race Conditions

A common pitfall with async validation on forms is to ensure a field's value hasn't changed during async validation. When your application receives async validation results, be sure to check that the current value still matches the value that was validated before rendering the validation result.

Fortunately, every validation result from Strickland includes the `value` that was validated as a result prop, making this straightforward.
