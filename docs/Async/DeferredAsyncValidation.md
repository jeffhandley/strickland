# Deferred Async Validation

When a validator returns a `Promise`, the `Promise` will begin resolution immediately, before the application invokes the `validateAsync` function. This is desired in some cases to begin resolving async validation eagerly so that async results are ready when `validateAsync()` is invoked. In other cases, the application may not call `validateAsync` until later in the workflow and the initial async result might not even be consumed.

To defer async validation until `validateAsync()` is called, validators can return a `function` that returns the async validation result `Promise`. Let's modify the `usernameIsAvailable` validator to defer async validation in this way.

``` jsx
import validate from 'strickland';

function usernameIsAvailableDeferred(username) {
    return function validateUsernameAsync() {
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
}

const result = validate(usernameIsAvailableDeferred, 'marty');

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

Aside from the validator returning a `function`, the rest of the workflow is exactly the same, and this was completely transparent to the application.
