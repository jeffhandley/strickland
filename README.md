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

#### custom(validationFunction, props)
Validate a value using a custom validation function
