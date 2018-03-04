# Async Validators

If you have wondered how async validators work with Strickland, you will be delighted at how simple they are: **a validator can return a `Promise`.**

Similar to how `validate` normalizes a boolean into validation result with an `isValid` property, a `Promise` is normalized into a validation result with a `validateAsync` property. The normalized `validateAsync` property is a function that returns a `Promise` resolving to the async result.

Let's take a look at a `usernameIsAvailable` validator. Just like synchronous validators, async validators can resolve to either boolean results or validation results with `isValid` properties.

``` jsx
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

When a validator returns a `Promise`, the normalized validation result will include `isValid: false` to indicate that the result is not (yet) valid.

## Resolving Async Validators

Because `validate` returns synchronously, your application must recognize when async validation needs to be resolved. The validation result returned from `validate` will only include the `validateAsync` property when a async validation needs to be resolved. If the `validateAsync` result property exists, it will be a `function` that returns a `Promise`.

``` jsx
const result = validate(usernameIsAvailable, 'marty');

// The application defines a `handleValidationResult` function
// to handle validation results when the are completed

if (result.validateAsync) {
    result.validateAsync().then((asyncResult) => handleValidationResult(asyncResult));
} else {
    handleValidationResult(result);
}
```

## Deferring Async Validation

When a validator returns a `Promise`, the code within the `Promise` will be evaluated regardless of the application invoking the `validateAsync` function. This is desired in some cases to begin resolving async validation eagerly so that async results are ready when `validateAsync()` is invoked. In other cases though, `validateAsync` will not be called until later in the workflow and the async result will not be consumed.

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

If the execution of the `Promise` is expensive, it is recommended to wrap the `Promise` in a function to defer the execution.

### The `validateAsync` Wrapper Function

To avoid boilerplate code, Strickland provides a `validateAsync` function as a named export. This function always returns a `Promise`, regardless of whether validation completed synchronously or needs to be resolved asynchronously.

``` jsx
import {validateAsync} from 'strickland';

const result = validateAsync(usernameIsAvailable, 'marty');
result.then((asyncResult) => handleValidationResult(asyncResult));
```

## Additional Async Features

Strickland has support for additional features related to async validation.

* [Async Validator Arrays and Objects](ValidatorArraysAndObjects.md)
* [Two Stage Sync/Async Validation](TwoStageValidation.md)
