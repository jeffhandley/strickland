# Change Log

### 0.0.6
Added field validators and updated min/max validator messages.

* fieldValue for validating a field's value is either exact or within a range
    * fieldValue(field, exactly) validates an exact value for the field
    * fieldValue(field, min, max) validates the field is within a range
* minFieldValue for validating a field's value is at least the min
* maxFieldValue for validating a field's value is at most the max

## 0.0.5
Validator renames for min/max validators.

* minvalue renamed to minValue
* maxvalue renamed to maxValue
* minlength renamed to minLength
* maxLength renamed to maxLength

## 0.0.4
API and implementation changes for length and value validators.

* exactvalue was replaced with value
    * value(exactly) validates an exact value
    * value(min, max) validates a value range
* exactlength was replaced with length
    * length(exactly) validates an exact length
    * length(min, max) validates a length range
* length, minlenth, and maxlength will now succeed if the value's length property is falsy

## 0.0.3
API and implementation changes to adopt a base validator.

* custom was renamed to validator
* validator is valid for falsy values
* All validators except for required use validator for their implementations
* required is the only validator that should validate that a value is provided
* Every validator can be used on optional data unless paired with a required validator

## 0.0.2
Minor refactoring of validation functions

## 0.0.1
Initial publication

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
