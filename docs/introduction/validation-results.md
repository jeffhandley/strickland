# Validation Results

Strickland normalizes validation results to always be objects with `isValid` and `value` properties.

If the validator returns a falsy value, then `isValid` will be `false`. If the validator returns a truthy value, then `isValid` will be `true`. If the validator returns an object, the truthiness of its `isValid` property will be used on the result's `isValid` property.

The `value` on the validation result will always be the value that was validated.

```jsx
import validate from 'strickland';

function letterA(value) {
    // We can return a validation result as a boolean
    return (value === 'A');

    // Or as an object
    // return {
    //    isValid: (value === 'A')
    // };
}

const result = validate(letterA, 'B');

// Either way, the result will match:
//
// result = {
//     isValid: false,
//     value: 'B'
// }
```

