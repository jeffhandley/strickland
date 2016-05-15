# Change Log

## 0.0.1
Initial publication

### ValidationResult
The class that represents a result, valid or invalid.  All validators return a ValidationResult.

#### Properties

* isValid (Boolean)

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

#### required(props)
The only validator to fail on falsy values

#### Length Validators
Validate the length of a string, array, or any object with a length property

* minlength(min, props)
* maxlength(max, props)
* exactlength(length, props)

#### Value Range Validators
Validate that a value is within the expected range

* minvalue(min, props)
* maxvalue(max, props)
* exactvalue(value, props)

#### custom(validateFunction, props)
Validate a value using a custom validation function
