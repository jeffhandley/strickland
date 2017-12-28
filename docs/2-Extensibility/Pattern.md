# Extensibility Pattern

Validator factories are often used to create validators that accept parameters. Validators can also receive validation context passed into Strickland's `validate` function. And validators can include arbitrary properties on validation results.

## Arbitrary Factory and Validation Context Properties

While some validators require specific parameters or context to function, it has become common for validators to accept and return *arbitrary* factory and validation context properties. This provides opportunities for applications to have very rich user experiences.

Consider the following implementation of our `letter` validator.

``` jsx
function letter(letterParam, validatorContext) {
    return function validateLetter(value, validationContext) {
        validationContext = {
            letter: letterParam,
            ...validatorContext,
            ...validationContext
        };

        return {
            message: `Must match "${validationContext.letter}"`,
            ...validationContext,
            isValid: (value === validationContext.letter)
        };
    }
}
```

With this approach, the validator can define a default message but allow the message to be overridden either by the validator factory or in the validation context. Plus, arbitrary properties flow through the factory and the context out to the validation result. This approach can unlock many scenarios where applications need to enrich the validation results.

*Note that the `isValid` result property should be applied after spreading the validation context properties. This guards against an application inadvertently passing `isValid` through on the context and overriding the actual validation results.*

Let's see how an application could pass more context through to the `letter` validator to get rich validation results.

``` jsx
import validate from 'strickland';

const termsAccepted = letter('Y', {
    fieldName: 'acceptTerms',
    message: 'Enter the letter "Y" to accept the terms'
});

const termsEntered = 'N';

const result = validate(termsAccepted, termsEntered, {
    formName: 'signupForm'
});

/*
result = {
    letter: 'Y',
    fieldName: 'acceptTerms',
    formName: 'signupForm',
    isValid: false,
    value: 'N'
}
*/
```

## Including Validator Context Properties on Validation Results

In the above pattern, the validator context and validation context were composed together at the time of validation and all context properties were included on the validation result.

In our example, this has the by-product of including the `letter` property on the validation result. This by-product can be helpful for applications and sometimes just helpful during application development. In our example, seeing the `letter` property on the validation result would simplify debugging if validation results were not as expected.

## Flexible Validator Factory Parameters

When applications provide context to validator factories, it can be convenient to simply include validator parameters within the context object. Validator factories can easily provide this flexibility by allowing the parameters and the context object to be either combined or separate.

Let's use this flexibility with the `letter` validator.

``` jsx
import validate from 'strickland';

function letter(letterParam, validatorContext) {
    if (typeof letterParam === 'object') {
        validatorContext = letterParam;
    } else {
        validatorContext = {
            ...validatorContext,
            letter: letterParam
        };
    }

    return function validateLetter(value, validationContext) {
        validationContext = {
            letter: letterParam,
            validatorContext,
            ...validationContext
        };

        return {
            message: `Must match "${validationContext.letter}"`,
            ...validationContext,
            isValid: (value === validationContext.letter)
        };
    }
}

const termsAccepted = letter({
    letter: 'Y',
    fieldName: 'acceptTerms',
    message: 'Enter the letter "Y" to accept the terms'
});

const termsEntered = 'N';

const result = validate(termsAccepted, termsEntered, {
    formName: 'signupForm'
});

/*
result = {
    letter: 'Y',
    fieldName: 'acceptTerms',
    formName: 'signupForm',
    isValid: false,
    value: 'N'
}
*/
```

Using the above patterns enables your application to use your validators in many different ways, producing rich results while not having to add any specific richness functionality into your validators. This keeps your validators decoupled from any application scenarios or user interface implementation details.
