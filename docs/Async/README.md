# Async Validators

If you have wondered how async validators would work with Strickland, you will be delighted at how simple they are. If a validator returns a `Promise`, then Strickland will return a `Promise` for the validation result. When the validation result promise is resolved, async validators will be resolved.

``` jsx
import validate from 'strickland';

function usernameIsAvailable(username) {
    if (!username) {
        return true;
    }

    return new Promise((resolve) => {
        if (username === 'marty') {
            resolve({
                isValid: false,
                message: `"${username}" is not available`
            });
        }

        resolve(true);
    });
}

validate(usernameIsAvailable, 'marty').then((result) => {
    /*
    result = {
        isValid: false,
        value: 'marty',
        message: '"marty" is not available'
    }
    */
});
```

When validation results are invalid, do not reject the promise. Instead, resolve the promise with a validation result that is not valid. As usual, this can be done by returning `false` or an object with `isValid: false`.

It is your application's responsibility to know if one of your validators could return a `Promise`; if so, then you will need to treat the result from `validate` as a `Promise`. If validation short-circuits before the `Promise` is encountered though, then a regular result will be returned instead of a `Promise`. Because of this possibility, it is recommended to wrap `Promise.resolve()` around the validation results and remove any uncertainty. This can be achieved by passing `async: true` in the validation context.

``` jsx
validate(validator, value, {async: true}).then(handleValidationResult);
```

## Additional Async Features

Strickland has support for additional features related to async validation.

* [Async Validator Arrays and Objects](ValidatorArraysAndObjects.md)
* [Two Stage Sync/Async Validation](TwoStageValidation.md)
