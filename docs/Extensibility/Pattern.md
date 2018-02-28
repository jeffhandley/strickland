# Extensibility Pattern

Validator factories are often used to create validators that accept parameters. Validators can resolve parameters at the time of validation using validation context. And validators can include arbitrary properties on validation results.

## Arbitrary Factory and Validation Context Properties

While some validators require specific parameters to function, it has become common for validators to accept and return *arbitrary* props on validation results. This provides opportunities for applications to have very rich user experiences.

Consider the following implementation of our `letter` validator.

``` jsx
function letter(letterParam, validatorProps) {
    return function validateLetter(value, context) {
        // Copy the param instead of overriding
        // `letterParam` with the function result
        const letterValue = letterParam;

        if (typeof letterValue === 'function') {
            letterValue = letterValue(context);
        }

        return {
            message: `Must match "${letterValue}"`,
            ...validatorProps,
            letter: letterValue,
            isValid: (value === letterValue)
        };
    }
}
```

With this approach, the validator can define a default message but allow the message to be overridden by validator props supplied to the factory. The resolved letter parameter is also echoed in the validation result. Plus, arbitrary properties flow through the factory to the validation result. This approach can unlock many scenarios where applications need to enrich the validation results.

*Note that the `isValid` result property should be applied after spreading the validator props. This guards against an application inadvertently passing `isValid` and overriding the actual validation results.*

Let's see how an application could pass more context through to the `letter` validator to get rich validation results.

``` jsx
import validate from 'strickland';

const termsAccepted = letter('Y', {
    fieldName: 'acceptTerms',
    message: 'Enter the letter "Y" to accept the terms'
});

const termsEntered = 'N';

const result = validate(termsAccepted, termsEntered);

/*
    result = {
        fieldName: 'acceptTerms',
        message: 'Enter the letter "Y" to accept the terms',
        letter: 'Y',
        isValid: false,
        value: 'N'
    }
 */
```
