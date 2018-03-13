# Built-In Validator: required

The `required` validator is the only validator that ensures a value is present. All other validators in Strickland will return `isValid: true` if the value supplied is empty. This approach allows all other validators to be applied to optional values. And as we'll explore shortly, validators can be composed to combine `required` with other validators.

The values that `required` recognizes as empty and invalid are:

1. `null`
1. `undefined`
1. `''` (empty string)
1. `false`

For all other values, including `0` (despite being is falsy), `required` will indicate the result is valid.

The `false` boolean value being invalid is commonly used to validate that checkboxes must be checked. For example, when a user must accept terms before submitting a form, the `checked` state of the checkbox can be validated with `required`.

## Named Props

* `required`: A boolean indicating whether or not the value is required (default: `true`)
    * If the parameter supplied is a boolean, it will be used as the `required` named prop

## Usage

``` jsx
import validate, {required} from 'strickland';

const nameRequired = required({
    message: 'Name is required'
});

const result = validate(nameRequired, '');

/*
    result = {
        required: true,
        message: 'Name is required',
        isValid: false,
        value: ''
    }
 */
```

The `required` validator respects a named prop of `required` that indicates whether or not the value is required. This is useful for dynamic validation scenarios where your application needs to support conditionally required fields; you can apply the `required` validator and dynamically supply the `required` named prop. If the `required` named prop is `false`, the validator will always return `isValid: true`.

``` jsx
// Required by default
const a = required();

// As a value parameter
const requiredField = required(true);
const optionalField = required(false);

// As a named prop
const nameRequired = required({
    required: true,
    message: '"Name" is required'
});

// As a function that resolves to have the named prop
const requiredValidator = required((context) => ({
    required: context.required,
    message: context.required ?
        '"Name" is required' :
        '"Name" is optional'
}));
```
