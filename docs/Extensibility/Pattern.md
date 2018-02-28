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

## Flexible Validator Factory Parameters

Named parameters are often implemented in JavaScript using objects. Validator factories can support this while still allowing a simple parameter when desired. Let's take a look at all of the ways we might want to invoke the `letter` validator factory.

``` jsx
const letterA = letter('A');
const letterFromContext = letter((context) => context.letter);

const letterAwithProps = letter('A', {message: 'Must be "A"'});
const letterFromContextWithProps = letter((context) => context.letter, {fieldName: 'acceptTerms'});

const propsFromContext = letter((context) => ({
    letter: context.letter,
    message: `Must be "${context.letter}"`
}));
```

This flexibility is extreme but it can be convenient for applications to be able to use validators in each of these ways. Because they are building blocks, all of Strickland's built-in validators support this flexibility. And the utility method used for Strickland's validators to gain this flexibility is available for your validators as well.

Strickland provides a `getValidatorProps` function with the following signature:

``` jsx
function getValidatorProps(namedProps, validatorParams, value, context) { }
```

Let's use `getValidatorProps` in our `letter` validator to support the flexibility illustrated above.

``` jsx
import validate, {getValidatorProps} from 'strickland';

function letter(...params) {
    return function validateLetter(value, context) {
        const validatorProps = getValidatorProps(

            ['letter'],     // named props, in their param order
            params,         // the param array supplied to the validator
            value,          // the value being validated
            context,        // the validation context
            {letter: 'A'}   // default named prop values
        );

        return {
            message: `Must match "${validatorProps.letter}"`,
            ...validatorProps,
            isValid: (value === letterValue)
        };
    }
}
```

Using the above patterns enables your application to use validators in many different ways, producing rich results while not having to add any specific richness into your validators. This keeps your validators decoupled from any application scenarios or user interface implementation details.
