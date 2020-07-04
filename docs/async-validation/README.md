# Async Validation

If you have wondered how async validation works with Strickland, you will be delighted at how simple it is: **a validator can use a `Promise`.**

Similar to how `validate` normalizes a boolean into validation result with an `isValid` property, a `Promise` is normalized into a validation result with a `validateAsync` property. The normalized `validateAsync` property is a function that returns a `Promise` resolving to the async result.

Let's take a look at a `usernameIsAvailable` validator. Just like synchronous validators, async validators can resolve to either boolean results or validation results with `isValid` properties.

```jsx
import validate from 'strickland';

function usernameIsAvailable(username) {
    return new Promise((resolve) => {
        if (username === 'marty') {
            // Resolve to an invalid validation result object
            resolve({
                isValid: false,
                message: `"${username}" is not available`
            });
        }

        // Resolve to a boolean
        resolve(true);
    });
}

const result = validate(usernameIsAvailable, 'marty');

result.validateAsync().then((asyncResult) => {
/*
    asyncResult = {
        isValid: false,
        value: 'marty',
        message: '"marty" is not available'
    }
 */
});
```

When a validator returns a `Promise`, the normalized validation result will include `isValid: false` to indicate that the result is not \(yet\) valid.
