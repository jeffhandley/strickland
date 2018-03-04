# Deferred Async Validation

When a validator returns a `Promise`, the code within the `Promise` will be evaluated regardless of the application invoking the `validateAsync` function. This is desired in some cases to begin resolving async validation eagerly so that async results are ready when `validateAsync()` is invoked. In other cases though, `validateAsync` will not be called until later in the workflow and the async result will not be consumed.

If the execution of the `Promise` is expensive, it is recommended to wrap the `Promise` in a function to defer its execution.

To defer async validation until `validateAsync()` is called, validators can return a `function` that returns the async validation result. While the `validateAsync` function can return any validation result, it's common to have the function return a `Promise` to perform actual async validation. Let's modify the `usernameIsAvailable` validator to not begin async validation until invoked by the application by wrapping the `Promise` in a `function`.

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
