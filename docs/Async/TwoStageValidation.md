# Two-Stage Sync/Async Validation

When a validator returns a `Promise`, the `validate` function actually applies a convention for the validation result. The `Promise` result is converted into a validation result object that has a `resolvePromise` prop with the `Promise` returned. This behavior is consistent with how boolean results are handled--they are wrapped in results where the boolean value is used as the `isValid` prop.

Because the handling of `Promise` results is just a convention, your validators can skip that convention when needed. Instead of directly returning a `Promise`, a validator can return a result with a `resolvePromise` prop that represents additional validation to be performed asynchronously. Additional props can be included alongside `resolveProp` for richer results.

As seen previously though, `validate` will directly return a `Promise` if any validation returns a `Promise`. This is due to a second convention that `validate` applies: if the validation result includes a `resolvePromise` result prop, that `Promise` will be directly returned. However, callers to `validate` can bypass that convention. To do so, pass a validation prop of `resolvePromise: false` and `validate` will return the actual result object containing the `resolvePromise` prop as the `Promise` to be resolved.

Understanding these conventions, it's possible to perform two-stage validation where the first stage produces partial, synchronous validation; and the second stage performs complete, asynchronous validation. The following example would allow a UI to render partial validation results along with a progress indicator for the validation still executing. When the final validation is complete, the UI would update to reflect the complete result.

``` jsx
import validate, {required, length} from 'strickland';

function checkUsernameAvailability(username) {
    if (!username) {
        // Return just a boolean - it will be
        // converted to a valid result
        return true;
    }

    // Return an initial result indicating the value is
    // not valid (yet), but validation is in progress
    return {
        isValid: false,
        message: `Checking availability of "${username}"...`,
        resolvePromise: new Promise((resolve) => {

            if (username === 'marty') {

                // Produce an async result object with
                // a message
                resolve({
                    isValid: false,
                    message: `"${username}" is not available`
                });
            }

            // Produce an async result using just a boolean
            resolve(true);
        })
    };
}

const validateUser = {
    name: [required(), length(2, 20)],
    username: [required(), length(2, 20), checkUsernameAvailability]
};

const user = {
    name: 'Marty McFly',
    username: 'marty'
};

// Pass {resolvePromise: false} to get immediate but partial results
const result = validate(validateUser, user, {resolvePromise: false});

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
            message: 'Checking availability of "marty"...'
            resolvePromise: Promise.prototype
        }
    },
    resolvePromise: Promise.prototype
}
*/

result.resolvePromise.then((asyncResult) => {
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
                message: '"marty" is not available',
                resolvePromise: false
            }
        },
        resolvePromise: false
    }
    */
});
```
