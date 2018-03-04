# Flexible Validator Factory Parameters

Named parameters are often implemented in JavaScript using objects. Validator factories can support this while still allowing a simple parameter when desired. Let's take a look at all of the ways we might want to invoke the `letter` validator factory.

``` jsx
const letterA = letter('A');
const letterFromContext = letter((context) => context.letter);

const letterAwithProps = letter('A', {message: 'Must be "A"'});

const letterFromContextWithProps = letter(
    (context) => context.letter,
    {fieldName: 'acceptTerms'}
);

const propsFromContext = letter((context) => ({
    letter: context.letter,
    message: `Must be "${context.letter}"`
}));
```

This flexibility is extreme but it can be convenient for applications to be able to use validators in each of these ways. Because they are building blocks, all of Strickland's built-in validators support this flexibility. And the utility method used for Strickland's validators to gain this flexibility is available for your validators as well.

## The getValidatorProps Utility

To provide consistently flexible validator factory param handling, Strickland provides a `getValidatorProps` utility function with the following signature:

``` jsx
function getValidatorProps(
    namedProps,
    validatorParams,
    value,
    context,
    defaultPropValues)
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
            isValid: (value === validatorProps.letter)
        };
    }
}
```

Using the above patterns enables your application to use validators in many different ways, producing rich results while not having to add any specific richness into your validators. This keeps your validators decoupled from any application scenarios or user interface implementation details.
