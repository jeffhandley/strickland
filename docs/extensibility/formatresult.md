# formatResult

When applications consume validation results, they often need to augment or transform the validation results from the validators. Not all of those scenarios can be accomplished through [Validator Result Props](https://github.com/jeffhandley/strickland/tree/8a3b29a7273e6ee6f0d3945a170af06068918227/docs/extensibility/validator-result-props.md), and a different mechanism is needed. Strickland's `formatResult` function can help. `formatResult` wraps a supplied validator and uses a specified result formatter function to augment or transform the result from the validator.

## Parameters

The `formatResult` function accepts two parameters:

1. The result formatter function
2. The validator to wrap

The parameters are specified in this order to make it easy to use `formatResult.bind()` with a result formatter function.

The result formatter function will be called with 2 parameters.

1. The result object from the validator, already normalized through Strickland's `validate` function.
2. An object containing `{value, context}` where `value` is the value that was validated and `context` is the validation context provided.

## Usage

The following example shows how `formatResult` can be used to augment the result of a very basic validator. The formatter uses the validated `value` to generate a `message` validation result prop.

```jsx
import validate, {formatResult} from 'strickland';

function letterA(value) {
    return (value === 'A');
}

function withMessage(result, {value}) {
    return {
        ...result,
        message: `The letter "A" was expected, but "${value}" was supplied`
    };
}

const validator = formatResult(withMessage, letterA);

const result = validate(validator, 'B');

/*
    result = {
        isValid: false,
        value: 'B',
        message: 'The letter "A" was expected, but the value "B" was supplied'
    }
*/
```



