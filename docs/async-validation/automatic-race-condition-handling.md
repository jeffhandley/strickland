# Automatic Race Condition Handling

Value change [race conditions](raceconditions.md) are a common pitfall with async validation to introduce boilerplate. To reduce this boilerplate code, Strickland can automatically handle these race conditions.

In the race condition handling example, we saw the application code check the current value against the value that async validation was performed against to determine if the value had changed. By providing Strickland with a way to get the current value during the async validation workflow, the async result can be automatically rejected if the value has changed.

This is done by passing a function to `validateAsync` that retrieves the current value. With that function, `validateAsync` will check the value when async validation completes. If the value is unchanged, the `Promise` will resolve normally; if the value _did change_ during async validation, the `Promise` will be rejected. The rejection will include the async result, but your application typically will not consume it.

```jsx
const usernameValidator = [
    required(),
    length({minLength: 2, maxLength: 20}),
    usernameIsAvailableTwoStage
];

let username = 'marty';
let usernameResult = validate(usernameValidator, username);

username = 'mcfly';

if (usernameResult.validateAsync) {
    usernameResult.validateAsync(() => username)
        .then((asyncResult) => {
            usernameResult = asyncResult;
        })
        .catch((rejectedResult) => {
            // the asyncResult result will be rejected
            // because the value has changed
        });
}
```

## Async Validation Helper: `validateAsync`

The `validateAsync` function exported from Strickland supports this same feature. Instead of passing the value to be validated, pass a function that returns the current value. If the value changes during async validation, the result `Promise` will reject.

```jsx
import {
    validateAsync, required, length
} from 'strickland';

const usernameValidator = [
    required(),
    length({minLength: 2, maxLength: 20}),
    usernameIsAvailableTwoStage
];

let username = 'marty';

validateAsync(usernameValidator, () => username)
    .then((asyncResult) => {
        // async validation completed
    })
    .catch((rejectedResult) => {
        // async validation rejected
    });

username = 'mcfly';
```
