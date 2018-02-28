# Built-In Validator: required

The `required` validator is the only validator that ensures a value is present. All other validators in Strickland will return `isValid: true` if the value supplied is empty. This approach allows all other validators to be applied to optional values. And as we'll explore shortly, validators can be composed to combine `required` with other validators.

The values that `required` recognizes as empty and invalid are:

1. `null`
1. `undefined`
1. `''` (empty string)
1. `false`

For all other values, including `0` (which is falsy), `required` will indicate the result is valid.

The `false` boolean value being invalid is commonly used to validate that checkboxes must be checked. For example, when a user must accept terms before submitting a form, the `checked` state of the checkbox can be validated with `required`.

## Named Props

* `required`: A boolean indicating whether or not the value is required (default: `true`)

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

The following code illustrates all the ways validator props can be supplied to the `required` validator.

``` jsx
// Required by default
const a = required();

// Specifying false disables this validator
// useful for dynamic validation scenarios
const b = required(false);

// Specifying validator props
const c = required(
    true,
    {message: 'Name is required'}
);

// Using a function to resolve the required prop
// along with validator props
const d = required(
    (context) => true,
    {message: 'Name is required'}
);

// Using a function to resolve the required prop
// along with a function to resolve validator props
const e = required(
    (context) => context.required,
    (context) => ({
        message: context.required ?
            'Name is required' :
            'Name is optional'
        }
    )
);

// Using a function to resolve validator props
const f = required((context) => ({
    required: context.required,
    message: context.required ?
        'Name is required' :
        'Name is optional'
}));
```
