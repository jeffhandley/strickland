# Built-In Validator: length

The `length` validator conveniently combines the `minLength` and `maxLength` validators to check that a value is within a range. Both the `minLength` and `maxLength` values are inclusive.

## Parameters

* `minLength`: The minimum value to compare against
* `maxLength`: The maximum value to compare against

## Result Properties

* `minLength`: The minimum value that was compared against
* `maxLength`: The maximum value that was compared against

## Usage

The following code illustrates all the ways the minimum and maximum values can be supplied.

``` jsx
import validate, {length} from 'strickland';

// As the first two parameters to the factory
const a = length(1, 2, {
    message: 'Must have a length between 1 and 2'
});

// Within the context passed to the factory
const b = length({
    minLength: 1,
    maxLength: 2,
    message: 'Must have a length between 1 and 2'
});

// As functions for the first two parameters to the factory
const c = length(() => 3, () => 4, {
    message: 'Must have a length between 3 and 4'
});

// As functions on the context passed to the factory
const d = length({
    minLength: () => 4,
    maxLength: () => 4,
    message: 'Must have a length between 3 and 4'
});

// As values on the validation context
const e = validate(length(), 100, {
    minLength: 5,
    maxLength: 6,
    message: 'Must have a length between 5 and 6'
});

// As functions on the validation context
const f = validate(length(), 100, {
    minLength: () => 5,
    maxLength: () => 6,
    message: 'Must have a length between 5 and 6'
});
```

The `minLength` and `maxLength` parameters are independent. You can supply either parameter using any of the available methods. For example, you could pass the `minLength` parameter as the first parameter to the factory but the `maxLength` value as a function on the validation context.

If a non-object value is supplied as the first parameter to the `length` validator factory, it is assumed to be the `minLength` parameter value.
