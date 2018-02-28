# Arrays of Validators

Values often need to be validated against multiple validators. This can be represented in Strickland by using arrays of validators with a top-level validator that operates over the array. The top-level validator can invoke the `validate` function to collect results from each validator and combine the results into a top-level validation result.

Here is a validator that validates every validator in an array, short-circuiting as soon as an invalid result is encountered.

``` jsx
import validate from './strickland';

export default function every(validators) {
    return function validateEvery(value, context) {
        let result = {
            value,
            isValid: true
        };

        validators.every((validator) => {
            let validatorResult = validate(
                validator, value, context
            );

            result = {
                ...result,
                ...validatorResult,
                isValid: validatorResult.isValid
            };

            return result.isValid;
        });

        return result;
    }
}
```

The `every` validator uses the factory pattern, accepting an array of validators and returning a function to validate every one of the validators. Because validators can accept validation context, those must be accepted and passed through.

Here is how the `every` validator can be used.

``` jsx
import validate, {every, required, minLength} from 'strickland';

const mustExistWithLength5 = every([required(), minLength(5)]);
const result = validate(mustExistWithLength5, '1234', {
    message: 'Must have a length of at least 5'
});

/*
    result = {
        isValid: false,
        value: '1234',
        required: true,
        minLength: 5,
        length: 4
    }
 */
```

## Built-In Composition Validators

Strickland has a few built-in composition validators that operate over arrays of validators.

* [every](every.md)
* [each](each.md)
* [some](some.md)
