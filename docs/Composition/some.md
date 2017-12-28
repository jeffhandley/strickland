# some

Strickland also provides an `some` validator. The `some` validator also operates over an array of validators and it behaves similarly to `every`, except that it will exit as soon as it encounters a *valid* result. If any of the validators in the array are valid, then the overall result will be valid.

## Parameters

The first parameter to the `some` validator factory is the array of validators. The second parameter is a `validatorContext` that is combined with the `validationContext` supplied to every validator. This allows context common to all validators to be supplied at the time of creation.

## Result Properties

* `some`: The array of validation results produced during validation

The `some` validator adds a `some` property to the validation result that provides the detailed validation results of every validator that was validated in the array of validators. The validation result property is named `props` to match the name of the validator (this is a common pattern in Strickland).

## Usage

``` jsx
import validate, {
    some, required, minLength, maxLength
} from 'strickland';

const mustExistWithLength5 = some([
    required({message: 'Required'}),
    maxLength(10, {message: 'Must have a length no greater than 10'}),
    minLength(5, {message: 'Must have a length of at least 5'})
]);
const result = validate(mustExistWithLength5, '');

/*
result = {
    isValid: true,
    value: '',
    required: true,
    maxLength: 10,
    message: 'Must have a length no greater than 10',
    some: [
        {
            isValid: false,
            value: '',
            required: true,
            message: 'Required'
        },
        {
            isValid: true,
            value: '',
            maxLength: 10,
            message: 'Must have a length no greater than 10'
        }
    ]
}
*/
```
