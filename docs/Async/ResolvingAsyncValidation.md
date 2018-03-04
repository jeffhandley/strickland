# Resolving Async Validators

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

## The `validateAsync` Wrapper Function

To avoid boilerplate code, Strickland provides a `validateAsync` function as a named export. This function always returns a `Promise`, regardless of whether validation completed synchronously or needs to be resolved asynchronously.

``` jsx
import {validateAsync} from 'strickland';

const result = validateAsync(usernameIsAvailable, 'marty');
result.then((asyncResult) => handleValidationResult(asyncResult));
```
