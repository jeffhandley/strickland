# each

Strickland also provides an `each` validator. The `each` validator operates over an array and it will only return a valid result if each and every validator in the array is valid. But `each` has a significant difference from `every`: `each` will always execute every validator, regardless of previous results. You can use `each` if all validators are safe to execute and you need to know all validator results, even if some are invalid.

## Parameters

The first parameter to the `each` validator factory is the array of validators. The second parameter is a `validatorContext` that is combined with the `validationContext` supplied to each validator. This allows context common to all validators to be supplied at the time of creation.

## Result Properties

* `each`: The array of validation results produced during validation

The `each` validator adds an `eacg` property to the validation result that provides the detailed validation results of each validator that was validated in the array of validators. The validation result property is named `each` to match the name of the validator (this is a common pattern in Strickland).

## Usage

``` jsx
import validate, {
    each, required, minLength, maxLength
} from 'strickland';

const mustExistWithLength5 = each([
    required({message: 'Required'}),
    minLength(5, {message: 'Must have a length of at least 5'}),
    maxLength(10, {message: 'Must have a length no greater than 10'})
]);
const result = validate(mustExistWithLength5, '1234');

/*
result = {
    isValid: false,
    value: '1234',
    required: true,
    minLength: 5,
    message: 'Must have a length no greater than 10',
    each: [
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
            message: 'Must have a length of at least 5'
        },
        {
            isValid: true,
            value: '1234',
            maxLength: 10,
            message: 'Must have a length no greater than 10'
        }
    ]
}
*/
```
