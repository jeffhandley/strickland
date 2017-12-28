# range

The `range` validator conveniently combines the `min` and `max` validators to check that a value is within a range. Both the `min` and `max` values are inclusive.

## Parameters

* `min`: The minimum value to compare against
* `max`: The maximum value to compare against

## Result Properties

* `min`: The minimum value that was compared against
* `max`: The maximum value that was compared against

## Usage

The following code illustrates all the ways the minimum and maximum values can be supplied.

``` jsx
import validate, {range} from 'strickland';

// As the first two parameters to the factory
const a = range(1, 2, {
    message: 'Must be between 1 and 2'
});

// Within the context passed to the factory
const b = range({
    min: 1,
    max: 2,
    message: 'Must be between 1 and 2'
});

// As functions for the first two parameters to the factory
const c = range(() => 3, () => 4, {
    message: 'Must be between 3 and 4'
});

// As functions on the context passed to the factory
const d = range({
    min: () => 4,
    max: () => 4,
    message: 'Must be between 3 and 4'
});

// As values on the validation context
const e = validate(range(), 100, {
    min: 5,
    max: 6,
    message: 'Must be between 5 and 6'
});

// As functions on the validation context
const f = validate(range(), 100, {
    min: () => 5,
    max: () => 6,
    message: 'Must be between 5 and 6'
});
```

The `min` and `max` parameters are independent. You can supply either parameter using any of the available methods. For example, you could pass the `min` parameter as the first parameter to the factory but the `max` value as a function on the validation context.

If a non-object value is supplied as the first parameter to the `range` validator factory, it is assumed to be the `min` parameter value.
