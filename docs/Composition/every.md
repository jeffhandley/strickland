# Built-In Validator: every

The `every` validator is built into Strickland. And it has a couple additional features not illustrated in the example implementation.

## Parameters

The first parameter to the `every` validator factory is the array of validators. Validator props can also be supplied either as an object or as a function that accepts context and returns a validator props object.

``` jsx
const atLeast5Chars = every(
    [
        required(),
        minLength({minLength: 5})
    ],
    {message: 'Must have at least 5 characters'}
);

const result = validate(atLeast5Chars, '1234');

const requiredWithMinLength = every(
    [
        required(),
        minLength((context) => ({minLength: context.minLength}))
    ],
    (context) => ({message: `Must have at least ${context.minLength} characters`})
);
```

## Result Properties

* `every`: The array of validation results produced during validation

The `every` validator adds an `every` property to the validation result with the validation results of every validator that was validated in the array of validators. Validators that were not executed because of validation failing early will be omitted from this array. The validation result property is named `every` to match the name of the validator (this is a common pattern in Strickland).

``` jsx
import validate, {every, required, minLength, maxLength} from 'strickland';

const mustExistWithLength5to10 = every([
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
        message: 'Must have at least 5 characters',
        every: [
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
            }
        ]
    }
 */
```

There are a few notable characteristics of this result:

1. The properties from each executed validator are added to the top-level result
    * The `required` validator added the `required: true` property to the result
    * The `minLength` validator added the `minLength: 5` property to the result
1. Property collisions are resolved using last-in-wins
    * In this example, the `message` from the `required` validator was replaced with the `message` from the `minLength` validator
    * This allows the message to reflect the deepest validation result in the array
1. Once validation fails for a validator, no further validation is performed
    * The `maxLength` validator was not executed
    * The props from the `maxLength` validator are not included on the result
    * The `every` array in the result does not include an item for the `maxLength` validator
1. The top-level `isValid` prop on the result reflects the overall validation result
