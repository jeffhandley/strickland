# Built-In Validator: some

Strickland provides a `some` validator. The `some` validator operates over an array of validators and it behaves similarly to `every`, except that it will exit as soon as it encounters a *valid* result. If any of the validators in the array are valid, then the overall result will be valid.

## Parameters

The first parameter to the `some` validator factory is the array of validators. Validator props can also be supplied either as an object or as a function that accepts context and returns a validator props object.

## Result Properties

* `some`: The array of validation results produced during validation

The `some` validator adds a `some` property to the validation result that provides the detailed validation results of every validator that was validated in the array of validators. The validation result property is named `some` to match the name of the validator (this is a common pattern in Strickland).

## Usage

``` jsx
import validate, {
    some, required, minLength, maxLength
} from 'strickland';

const max5orMin10orValue7 = some([
    max(5),
    min(10),
    compare(7)
]);

const result = validate(max5orMin10orValue7, 12);

/*
    result = {
        isValid: true,
        value: 12,
        max: 5,
        min: 10,
        some: [
            {
                isValid: false,
                value: 12,
                max: 5
            },
            {
                isValid: true,
                value: 12,
                min: 10
            }
        ]
    }
 */
```

There are a few notable characteristics of this result:

1. The properties from each executed validator are added to the top-level result
    * The `max` validator added the `max: 5` property to the result
    * The `min` validator added the `min: 10` property to the result
1. Property collisions are resolved using last-in-wins
1. Once validation succeeds for a validator, no further validation is performed
    * The `compare` validator was not executed
    * The props from the `compare` validator are not included on the result
    * The `some` array in the result does not include an item for the `compare` validator
1. The top-level `isValid` prop on the result reflects the overall validation result
