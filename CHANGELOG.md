# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0"></a>
# [1.0.0](https://github.com/jeffhandley/strickland/compare/0.0.8...1.0.0) (2017-12-09)


### Features

* starting over with fresh approach ([601d926](https://github.com/jeffhandley/strickland/commit/601d926))


### BREAKING CHANGES

* redefining the API



# Change Log

## 0.0.8
Add a new validation.validate(value, validators) function that returns a structured object with:

* results
* errors
* isValid

If the validators argument is an object, then an object with the same structure will be returned, where each field will be an object with results, errors, and isValid.

To support this, these functions are also exported:

* getErrorsFromResults(results)
** Returns either an array of errors or an object with errors
* isValidFromResults(results)
** Returns a boolean indicating if all results are valid

## 0.0.7
Update the export approach to make it easier to import for a variety of use cases.

* import strickland from 'strickland';
** { ValidationResult, validation, validators, ...validators }
* import * as strickland from 'strickland';
** { ValidationResult, validation, validators, ...validators }
* import { ValidationResult, validation, validators, required }

Also removed the prepublish script so that it wouldn't run build/tests during install.

## 0.0.6
Validator parameters flow through to the results, allowing results to be associated back with the fields and validators.

Respect a fieldName property for field validators, using it within the message.

Add a validator property onto results, indicating which validator function was used to get the result.

Added object validation support to validation.getResults, validation.getErrors, and validation.isValid.

## 0.0.5
Validator renames for min/max validators.

* minvalue renamed to minValue
* maxvalue renamed to maxValue
* minlength renamed to minLength
* maxLength renamed to maxLength

Added field validators and updated min/max validator messages.
* fieldValue for validating a field's value is either exact or within a range
    * fieldValue(field, exactly) validates an exact value for the field
    * fieldValue(field, min, max) validates the field is within a range
* minFieldValue for validating a field's value is at least the min
* maxFieldValue for validating a field's value is at most the max

Added an isIgnored property for validator to override the decision for ignoring values; ValidationResult instances then get an isIgnored property to indicate whether or not the validator was ignored.

Prevent mutation of props passed to validators.

Utilize isIgnored so that required can use validator.  Change behavior of required and how empty values are identified.

* required now treats empty arrays and objects as invalid
    * All other validators check the result of required to determine if the value should be ignored

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
