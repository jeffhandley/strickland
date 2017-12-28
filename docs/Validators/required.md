# required

The `required` validator is the only validator that ensures a value is present. All other validators in Strickland will return `isValid: true` if the value supplied is empty. This approach allows all other validators to be applied to optional values. And as we'll explore shortly, validators can be composed to combine `required` with other validators.

The values that `required` recognizes as empty and invalid are:

1. `null`
1. `undefined`
1. `''` (empty string)
1. `false`

For all other values, `required` will indicate the result is valid.

The `false` boolean value being invalid is commonly used to validate that checkboxes must be checked. For example, when a user must accept terms before submitting a form, the `checked` state of the checkbox can be validated with `required`.

## Parameters

None

## Result Properties

* `required`: A boolean with the value of `true`

## Usage

``` jsx
import validate, {required} from 'strickland';

const nameRequired = required({
    message: 'Name is required'
});

const result = validate(nameRequired, '');

/*
result = {
    isValid: false,
    value: '',
    required: true,
    message: 'Name is required'
}
*/
```
