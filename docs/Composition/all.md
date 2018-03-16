# Built-In Validator: all

Strickland provides an `all` validator. The `all` validator operates over an array and it will only return a valid result if all validators in the array are valid. But `all` has a significant difference from `every`: `all` will always execute all validators, regardless of previous results. You can use `all` if all validators are safe to execute and you need to know all validator results, even if some are invalid.

## Parameters

The first parameter to the `all` validator factory is the array of validators. Validator props can also be supplied either as an object or as a function that accepts context and returns a validator props object.

``` jsx
const atLeast5Chars = all(
    [
        required(),
        minLength(5)
    ],
    {message: 'Must have at least 5 characters'}
);

const result = validate(atLeast5Chars, '1234');

const requiredWithMinLength = all(
    [
        required(),
        minLength((context) => ({minLength: context.minLength}))
    ],
    (context) => ({message: `Must have at least ${context.minLength} characters`})
);
```

## Result Properties

* `all`: The array of validation results produced during validation

The `all` validator adds an `all` property to the validation result with the validation results of all validators that were validated in the array of validators. The validation result property is named `all` to match the name of the validator (this is a common pattern in Strickland).

## Usage

``` jsx
import validate, {
    all, required, minLength, maxLength
} from 'strickland';

const mustExistWithLength5to10 = all([
    required({message: 'Required'}),
    minLength({minLength: 5, message: 'Must have at least 5 characters'}),
    maxLength({maxLength: 10, message: 'Must have at most 10 characters'})
]);
const result = validate(mustExistWithLength5to10, '1234');

/*
    result = {
        isValid: false,
        value: '1234',
        required: true,
        minLength: 5,
        message: 'Must have at most 10 characters',
        all: [
            {
                isValid: true,
                value: '1234',
                required: true,
                message: 'Required'
            },
            {
                isValid: false,
                value: '1234',
                minLength: 5,
                message: 'Must have at least 5 characters'
            },
            {
                isValid: true,
                value: '1234',
                maxLength: 10,
                message: 'Must have at most 10 characters'
            }
        ]
    }
 */
```

There are a few notable characteristics of this result:

1. The properties from all executed validators are added to the top-level result
    * The `required` validator added the `required: true` property to the result
    * The `minLength` validator added the `minLength: 5` property to the result
    * The `maxLength` validator added the `maxLength: 10` property to the result
1. Property collisions are resolved using last-in-wins
    * In this example, the `message` from the `maxLength` validator replaced the messages provided by the `required` and `minLength` validators
    * This behavior is consistent and predictable with Strickland, but limits how top-level result properties can be used with the `all` validator
1. All validators are executed, even after the result is known to be invalid
1. The top-level `isValid` prop on the result reflects the overall validation result
