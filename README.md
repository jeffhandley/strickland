# strickland
JavaScript data validation. Ideal for universal React applications that use Flux, Redux, or similar patterns.

Strickland is a unique and robust approach to validating data in JavaScript.

* It is *not* a type system and it does not interfere with how you create and manage data
* Instead, validation rules are defined separately and run against the data
* While strickland can be used within the UI layer (including React components), it is not limited to use within UI
* Universal applications can share validators across both client-side and server-side validation
* With its extensibility, strickland supports complex scenarios in large line-of-business applications

## API

### ValidationResult
The class that represents a result, valid or invalid.  All validators return a ValidationResult.

#### Properties

* isValid

#### Extensibility
Custom properties provided to validators flow through onto the ValidationResult.  All built-in validators provide the following additional properties:

* message

### validation
Collection of functions for executing validators.

* getResults(value, validators)
    * Returns an array of ValidationResult instances
    * Includes both valid and invalid results
* getErrors(value, validators)
    * Returns an array of ValidationResult instances
    * Includes only invalid results
* isValid(value, validators)
    * Returns true when all validators are valid

### Validators

#### validator(validationFunction, props)
Validate a value using a validation function.
The validation function is only called if the value is truthy.

#### required(props)
Succeeds for truthy values and fails on falsy values.
The only validator to fail on falsy values.

#### value(min, max, props)
Succeeds when a number, string, or date is either an exact value or within a range.

* If only a min is provided, or the max provided is less than or equal to the min, the value must match the min exactly to be valid
* If both a min and max are provided and the max is greater than the min, the length must be within the min/max range

#### minvalue(min, props)
Succeeds when a number, string, or date is at least the specified min.

#### maxvalue(max, props)
Succeeds when a number, string, or date is at most the specified min.

#### length(min, max, props)
Succceds when the length property of a string, array, or object is either an exact value or within a range.

* If only a min is provided, or the max provided is less than or equal to the min, the length must match the min exactly to be valid
* If both a min and max are provided and the max is greater than the min, the length must be within the min/max range

#### minlength(min, props)
Succeeds when the length property of a string, array, or object is at least the specified min.

#### maxlength(max, props)
Succeeds when the length property of a string, array, or object is at most the specified max.

