# Extensibility Pattern

While some validators require specific props to function, it is common for validators to accept _arbitrary_ validator props on return them on validation results. This provides opportunities for applications to have very rich user experiences.

Consider the following implementation of our letter validator.

```jsx
function letterValidator(validatorProps) {
    return function validateLetter(value, context) {
        // Be sure not to overwrite the original
        // validatorProps variable (which would affect
        // repeated validation calls)
        let resolvedProps = validatorProps;

        if (typeof resolvedProps === 'function') {
            resolvedProps = resolvedProps(context);
        }

        resolvedProps = resolvedProps || {};

        const {letter} = resolvedProps;

        return {
            message: `Must match "${letter}"`,
            ...resolvedProps,
            isValid: (value === letter)
        };
    }
}
```

With this approach, the validator can define a default message but allow the message to be overridden by validator props supplied to the factory. The resolved letter prop is also echoed in the validation result. Plus, arbitrary properties flow through the factory to the validation result. This approach can unlock many scenarios where applications need to enrich the validation results.

_Note that the `isValid` result property should be applied after spreading the validator props. This guards against an application inadvertently passing `isValid` and overriding the actual validation results._

Let's see how an application could pass more context through to the letter validator to get rich validation results.

```jsx
import validate from 'strickland';

const termsAccepted = letterValidator({
    letter: 'Y',
    fieldName: 'acceptTerms',
    message: 'Enter the letter "Y" to accept the terms'
});

const termsEntered = 'N';

const result = validate(termsAccepted, termsEntered);

/*
    result = {
        letter: 'Y',
        fieldName: 'acceptTerms',
        message: 'Enter the letter "Y" to accept the terms',
        isValid: false,
        value: 'N'
    }
 */
```

