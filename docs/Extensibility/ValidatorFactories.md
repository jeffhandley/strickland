# Validator Factories

Validators often need to be configurable. Instead of always validating that a value matches the letter 'A', our letter validator might need to accept which letter to compare against. To accomplish that, we can define a **Validator Factory** that accepts props, including the desired letter, and returns a validator to be used.

```jsx
import validate from 'strickland';

function letterValidator({letter}) {
    return (value) => value === letter;
}

const validator = letterValidator({letter: 'B'});
const result = validate(validator, 'B');

/*
    result = {
        isValid: true,
        value: 'B'
    }
 */
```

Validator factories merely take advantage of JavaScript's functional nature--in fact, Strickland has no awareness of them. Strickland only requires that validators are functions that accept a value and return a validation result. You can produce those functions however you'd like, but the validator factory approach is a convenient way to extend the functionality of your validators.

