# Extensible Validation Results

You may have noticed that examples so far have not included any validation messages. Validation messages are often the heart of validation libraries, but Strickland actually has no concept of them. This ensures you can build your application with the user experience you need, including style and localization of your own messages, without any interference from Strickland or any possibility of a default validation message leaking through.

***But how do you get validation messages on results?*** As was mentioned in our [core concepts](/docs/1-Introduction/CoreConcepts.md), a validator can return either a boolean or a validation result object with an `isValid` property. Validation result objects can have additional properties; those properties flow through Strickland's `validate` function to be available to your application.

Let's extend the `letter` validator to include a message property on its result.

``` jsx
import validate from 'strickland';

function letter(letterParam) {
    return function validateLetter(value, validationContext) {
        validationContext = {
            letter: letterParam,
            ...validationContext
        };

        return {
            message: `Must match "${validationContext.letter}"`,
            isValid: (value === validationContext.letter)
        };
    }
}

const validator = letter();
const result = validate(validator, 'A', { letter: 'A' });

/*
result = {
    message: 'Must match "A"',
    isValid: true,
    value: 'B'
}
*/
```

Validation results can include any additional properties that are needed for your application regardless of whether the result is valid. Your application can then decide how and when to consume those properties. As an example, some user interfaces show successful validation messages to give positive feedback to the user.

Strickland will ensure that all validation results have an `isValid` property that is a boolean, and Strickland will always add a `value` property that reflects the validated value, but the rest is up to you. Validation messages are perhaps the most common property added, but validators can include any details needed on the results.
