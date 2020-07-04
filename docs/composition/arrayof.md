# arrayOf

Strickland provides an `arrayOf` validator to validate arrays of values against a supplied validator. The `arrayOf` validator first validates that the value is an `Array` (using `Array.isArray`), and then it validates all elements of that array using the supplied validator.

## Parameters

The first parameter to the `arrayOf` validator factory is validator that will be used to validate each element of the value array. Validator props can also be supplied either as an object or as a function that accepts context and returns a validator props object.

``` jsx
const allValuesRequired = arrayOf(
    required(),
    {message: 'Must have at least 5 characters'}
);

const result = validate(allValuesRequired, ['First', '', 'Third']);

const allValuesHaveMinLength = arrayOf(
    minLength((context) => ({minLength: context.minLength}))
    (context) => ({message: `All values must have at least ${context.minLength} characters`})
);
```

## Result Properties

* `arrayOf`: The array of validation results produced during validation

The `arrayOf` validator adds an `arrayOf` property to the validation result with the validation results of every array element that was validated. The validation result property is named `arrayOf` to match the name of the validator (this is a common pattern in Strickland).

``` jsx
import validate, {every, required, minLength, maxLength} from 'strickland';

const allValuesHaveMinLength = arrayOf(
    minLength((context) => ({minLength: context.minLength}))
    (context) => ({message: `All values must have at least ${context.minLength} characters`})
);

const result = validate(
    allValuesHaveMinLength,
    ['1', '12', '123', '1234'],
    {minLength: 3}
);

/*
    result = {
        isValid: false,
        value: ['1', '12', '123', '1234'],
        message: 'All values must have at least 3 characters',
        arrayOf: [
            {
                isValid: false,
                value: '1',
                minLength: 3,
                length: 1
            },
            {
                isValid: false,
                value: '12',
                minLength: 3,
                length: 2
            },
            {
                isValid: true,
                value: '123',
                minLength: 3,
                length: 3
            },
            {
                isValid: true,
                value: '1234',
                minLength: 3,
                length: 4
            }
        ]
    }
 */
```
