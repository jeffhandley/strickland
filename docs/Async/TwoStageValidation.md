# Two-Stage Sync/Async Validation

While validators can be executed asynchronously using `validateAsync`, there are scenarios where partial, synchronous results can be valuable in your applications. These scenarios can defer the asynchronous validation until the right time in the user's workflow, achieving two-stage sync/async validation.

We learned early on that validators can return either a boolean or a result object with the boolean as an `isValid` property. Async validators work similarly: to opt into async validation, validators can return any of the following:

* A `Promise` that resolves to a validation result
* A `function` that returns a validation result (including a `Promise` that resolves to a validation result)
* A result object with a `Promise` on the `validateAsync` property
* A result object with a `validateAsync` function

We also know that validators can include additional properties on their validation results; this is still true when one of those properties is `validateAsync`. Those additional properties will be available to the application synchronously, before resolving the asynchronous result.

Let's modify the `usernameIsAvailable` validator to make it return both a synchronous result and an asynchronous result.

``` jsx
function usernameIsAvailableTwoStage(username) {
    if (!username) {
        // Do not check availability of an empty username

        // Return just a boolean - it will be
        // converted to a valid result
        return true;
    }

    // Return an initial result indicating the value is
    // not (yet) valid, but availability will be checked
    return {
        isValid: false,
        message: `Checking availability of "${username}"...`,
        validateAsync() {
            return new Promise((resolve) => {
                if (username === 'marty') {
                    resolve({
                        isValid: false,
                        message: `"${username}" is not available`
                    });
                } else {
                    resolve({
                        isValid: true,
                        message: `"${username}" is available`
                    });
                }
            });
        }
    };
}
```

This pattern makes it possible to perform two-stage validation where the first stage produces partial, synchronous validation and the second stage performs complete, asynchronous validation. Validators can even mark their initial results with `isValid: true` if synchronous validation should be treated as valid.

In the following example, the application will render the partial, synchronous validation results; resolve the asynchronous validation; and render the final result once complete.

``` jsx
import validate, {required, length} from 'strickland';

const userValidator = {
    name: [
        required(),
        length(2, 20)
    ],
    username: [
        required(),
        length(2, 20),
        usernameIsAvailableTwoStage
    ]
};

const user = {
    name: 'Marty McFly',
    username: 'marty'
};

const result = validate(userValidator, user);

/*
    result = {
        isValid: false,
        props: {
            name: {
                isValid: true,
                value: 'Marty McFly'
            },
            username: {
                isValid: false,
                value: 'marty',
                required: true,
                minLength: 2,
                maxLength: 20,
                message: 'Checking availability of "marty"...',
                validateAsync: [Function]
            }
        },
        validateAsync: [Function]
    }
 */

result.validateAsync().then((asyncResult) => {
/*
    asyncResult = {
        isValid: false,
        props: {
            name: {
                isValid: true,
                value: 'Marty McFly'
            },
            username: {
                isValid: false,
                value: 'marty',
                required: true,
                minLength: 2,
                maxLength: 20,
                message: '"marty" is not available'
            }
        }
    }
 */
});
```
