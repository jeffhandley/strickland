# Race Conditions

A common pitfall with async validation is to ensure the value hasn't changed during async validation. Fortunately, every validation result from Strickland includes the `value` that was validated as a result prop, making these race conditions possible to detect and guard against.

Let's take a look at handling this race condition in application code:

```jsx
const usernameValidator = [
    required(),
    length(2, 20),
    usernameIsAvailableTwoStage
];

let username = 'marty';
let usernameResult = validate(usernameValidator, username);

username = 'mcfly';

if (usernameResult.validateAsync) {
    usernameResult.validateAsync().then((asyncResult) => {
        if (asyncResult.value === username) {
            // this will not be reached since
            // the username has changed
            usernameResult = asyncResult;
        }
    });
}
```

