# Strickland

Strickland is a JavaScript validation _framework_ with a focus on extensibility and composition.
It's pure, universal JavaScript and while it works well with React, Redux, or other libraries,
Strickland is not coupled to any other library or application type.

Strickland is a unique and robust approach to building validation into your application.

* It is *not* a type system and it does not interfere with how you create and manage data
* Instead, validation rules are defined separately from the data
* While Strickland can be used within the UI layer (including React components), it is not limited to use within UI
* Universal applications can share validators across both client-side and server-side validation
* With its extensibility, Strickland supports complex scenarios in large line-of-business applications

Strickland focuses not on being a bloated collection of validators, but instead on enabling you to create
your own collection of validators that can be composed together easily.

[https://www.npmjs.com/package/strickland](https://www.npmjs.com/package/strickland)

## Creating a Validator

Validators are functions that take values and return a validation result. Here is an extremely simple validator
that validates that the value supplied is the letter 'A'.

``` jsx
function letterA(value) {
    return (value === 'A');
}
```

## Perfoming Validation

Strickland's default export is a `validate` function that accepts the validator function and the value to
validate, and returns the validation result.

``` jsx
import validate from 'strickland';

function letterA(value) {
    return (value === 'A');
}

const result = validate(letterA, 'B');

/*
result = {
    isValid: false,
    value: 'B'
}
*/
```

### Validation Results

Strickland normalizes the validation result to always be an object with `isValid` and `value` properties.

If the validator returns a falsy value, then `isValid` will be `false`. If the validator returns `true`, then
`isValid` will be `true`. If the validator returns an object, the truthiness of its `isValid` property will
be used on the result's `isValid` property.

The `value` on the validation result will always be the value that was validated.

## Creating Configurable Validators

Validators often need to be configurable. Instead of always validating that a value is the letter 'A',
we might need to specify what letter to check for. To accomplish that, we can define a validator factory
that accepts the desired letter and returns a validator to be used.

``` jsx
import validate from 'strickland';

function letter(letterProp) {
    return function validateLetter(value) {
        return (value === letterProp);
    }
}

const result = validate(letter('B'), 'B');

/*
result = {
    isValid: true,
    value: 'B'
}
*/
```

## Validation Messages

Strickland does not produce any validation messages itself; your applications and validator libraries are
responsible for handling messages. This approach ensures you can build your application with the user
experience you need, including localization of your own messages, without any possibility of a default
message leaking through.

*But how do you get validation messages on results?* As was mentioned a moment ago, a validator can
return an object with an `isValid` property; this object can also have additional properties. Those
additional properties will flow through Strickland's `validate` function and be visible to your
application.

``` jsx
import validate from 'strickland';

function letter(letterProp) {
    return function validateLetter(value) {
        return {
            isValid: (value === letter),
            message: `Must match the letter ${letterProp}`
        };
    }
}

const result = validate(letter('A'), 'B');

/*
result = {
    isValid: false,
    value: 'B',
    message: 'Must match the letter A'
}
*/
```

## Validation Prop Patterns

It has become common for validators to accept and return arbitrary props; this provides opportunities for
applications to have very rich user experiences. Consider the following implementation of our letter
validator.

``` jsx
function letter(letterProp, validatorProps) {
    if (typeof letterProp === 'object') {
        validatorProps = letterProp;

    } else {
        validatorProps = {
            ...validatorProps,
            letter: letterProp
        };
    }

    return function validateLetter(value) {
        return {
            message: `Must match the letter ${letter}`,
            ...validatorProps,
            isValid: (value === letter)
        };
    }
}
```

With this approach, the consumer can now override the message returned by the validator and even add
new properties to the validation result. Here are some examples for calling this validator.

``` jsx
import validate from 'strickland';

const letterX = letter('X', {fieldLabel: 'letter'});

const acceptTerms = letter('Y', {
    fieldLabel: 'terms',
    message: 'Enter the letter Y to accept the terms'
});

const letter = 'X';
const terms = 'N';

const letterResult = validate(letterX, letter);
const termsResult = validate(acceptTerms, terms);

/*
letterResult = {
    isValid: true,
    value: 'X',
    letter: 'X',
    fieldLabel: 'letter',
    message: 'Must match the letter X'
}

termsResult = {
    isValid: false,
    value: 'N',
    letter: 'Y',
    fieldLabel: 'terms',
    message: 'Enter the letter Y to accept the terms'
}
*/
```

### Validation-Time Props

Occassionally, a validator will need to accept props at the time of validation. For example, if we had
two values and we wanted to ensure they are the same letter, we would need to pass the letter prop in
at the time of validation.

To enable this, Strickland's `validate` function accepts a props argument after the value to be validated,
and those props are passed to the validator. We can extend our `letter` validator to support this use case.

``` jsx
import validate from 'strickland';

function letter(letterProp, validatorProps) {
    if (typeof letterProp === 'object') {
        validatorProps = letterProp;

    } else {
        validatorProps = {
            ...validatorProps,
            letter: letterProp
        };
    }

    return function validateLetter(value, props) {
        props = {
            ...validatorProps,
            ...props
        };

        return {
            message: `Must match the letter ${letter}`,
            ...props,
            isValid: (value === letter)
        };
    }
}

const secondMatchesFirst = letter({
    message: 'The second value must match the first value'
});

const first = 'M';
const second = 'N';

const result = validate(secondMatchesFirst, second, {letter: first});

/*
result = {
    isValid: false,
    value: 'N',
    letter: 'M',
    message: 'The second value must match the first value'
}
*/
```

## Built-In Validators

Strickland provides a small set of fundamental validators, serving as the core building blocks that
your applications can use.

### compare

The `compare` validator is quite similar to the `letter` validator we've built. In fact, it only has
one additional feature. It accepts a function for the `compare` prop so that the compare value can
be fetched at the time of validation even more easily than providing it as a
validation-time prop.

#### Usage

``` jsx
import validate, {compare} from 'strickland';

const a = compare('A', {message: 'Must be the letter A'});
const b = compare({compare: 'B', message: 'Must be the letter B'});

const c = 'C';
const d = compare(() => c, {message: 'Must match c'});

const e = 'E';
const f = compare({compare: () => e, message: 'Must match e'});

const g = 'G';
const matchesAtValidation = compare();

const result = validate(matchesAtValidation, 'H', {
    compare: () => g,
    message: 'Must match g'
});
```

### min

The `min` validator checks that a value is at least the min provided.

#### Usage

``` jsx
import validate, {min} from 'strickland';

const min5 = min(5, {message: 'Must be at least 5'});
const min6 = min({min: 6, message: 'Must be at least 6'});

const minValue = 8;
const applyminWithArg = min(() => minValue);
const applyminWithProp = min({min: () => minValue});

const matchesAtValidation = min();
const result = validate(matchesAtValidation, 7, {
    min: () => minValue
});
```

### max

The `max` validator checks that a value is no greater than the max provided.

#### Usage

``` jsx
import validate, {max} from 'strickland';

const max5 = max(5, {message: 'Must be no more than 5'});
const max6 = max({max: 6, message: 'Must be no more than 6'});

const maxValue = 8;
const applyMaxWithArg = max(() => maxValue);
const applyMaxWithProp = max({max: () => maxValue});

const matchesAtValidation = max();
const result = validate(matchesAtValidation, 9, {
    max: () => maxValue
});
```

### range

The `range` validator conveniently combines the `min` and `max` validators to check
that a value is within a range.

#### Usage

``` jsx
import validate, {range} from 'strickland';

const range5to7 = range(5, 7, {
    message: 'Must be between 5 and 7'
});

const range7to9 = range({
    min: 7,
    max: 9,
    message: 'Must be between 7 and 9'
});

const minValue = 6;
const maxValue = 8;

const applyWithArgs = range(() => minValue, () => maxValue);

const applyWithProps = range({
    min: () => minValue,
    max: () => maxValue
});

const matchesAtValidation = range();
const result = validate(matchesAtValidation, 9, {
    min: () => minValue,
    max: () => maxValue
});
```

### minLength

The `minLength` validator checks that a value has a length no greater than the max length provided.

#### Usage

``` jsx
import validate, {minLength} from 'strickland';

const minLength5 = minLength(5, {
    message: 'Must have a length of at least 5'
});

const minLength6 = minLength({
    minLength: 6,
    message: 'Must have a length of at least 6'
});

const minLengthValue = 8;

const applyminLengthWithArg = minLength(() => minLengthValue);

const applyminLengthWithProp = minLength({
    minLength: () => minLengthValue
});

const matchesAtValidation = minLength();
const result = validate(matchesAtValidation, '1234567', {
    minLength: () => minLengthValue
});
```

### maxLength

The `maxLength` validator checks that a value has a length no greater than the max length provided.

#### Usage

``` jsx
import validate, {maxLength} from 'strickland';

const maxLength5 = maxLength(5, {
    message: 'Must have a length no more than 5'
});

const maxLength6 = maxLength({
    maxLength: 6,
    message: 'Must have a length no more than 6'
});

const maxLengthValue = 8;

const applyMaxLengthWithArg = maxLength(() => maxLengthValue);

const applyMaxLengthWithProp = maxLength({
    maxLength: () => maxLengthValue
});

const matchesAtValidation = maxLength();
const result = validate(matchesAtValidation, '123456789', {
    maxLength: () => maxLengthValue
});
```

### length

The `length` validator conveniently combines the `minLength` and `maxLength` validators to check
that a value has a length within a range.

#### Usage

``` jsx
import validate, {length} from 'strickland';

const length5to7 = length(5, 7, {
    message: 'Must be between 5 and 7'
});

const length7to9 = length({
    min: 7,
    max: 9,
    message: 'Must be between 7 and 9'
});

const minLengthValue = 6;
const maxLengthValue = 8;

const applyWithArgs = length(
    () => minLengthValue,
    () => maxLengthValue
);

const applyWithProps = length({
    minLength: () => minLengthValue,
    maxLength: () => maxLengthValue
});

const matchesAtValidation = length();
const result = validate(matchesAtValidation, '123456789', {
    minLength: () => minLengthValue,
    maxLength: () => maxLengthValue
});
```

### required

The `required` validator is the only validator that ensures a value is present. All other validators
in Strickland will return `isValid: true` if the value supplied is empty. This approach allows all other
validators to be applied to optional values. And as we'll explore shortly, validators can be composed
to combine `required` with other validators.

The values that `required` recognizes as empty and invalid are:

1. `null`
1. `undefined`
1. `''` (empty string)
1. `false` (Boolean)

For all other values, `required` will indicate the result is valid.

The `false` Boolean value being invalid is commonly used to validate that checkboxes must be checked. For example,
when a user must accept terms before submitting a form, the `checked` state of the checkbox can be validated
with `required`.

### Usage

``` jsx
import validate, {required} from 'strickland';

const nameRequired = required({
    message: 'Name is required'
});

const result = validate(nameRequired, '');

/*
result = {
    isValid: false,
    value: '',
    required: true,
    message: 'Name is required'
}
*/
```

## Composing Validators

Strickland gains its power through composition of validators. Because every validator is simply a
function, it is easy to create a function that executes multiple validators. Here is a validator that
validates every validator in an array, short-circuiting as soon as an invalid result is encountered.

``` jsx
import validate from './strickland';

export default function every(validators) {
    return function validateEvery(value, validationProps) {
        let result = {
            ...validationProps,
            value,
            isValid: true
        };

        validators.every((validator) => {
            let validatorResult = validate(
                validator, value, validationProps
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

The `every` validator uses the factory pattern, accepting an array of validators and returning
a function to validate every one of the validators. Because validators can accept validation
props, those must be accepted and passed through. By convention, those props should be included
on the validation result object too.

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
    message: 'Must have a length of at least 5'
}
*/
```

### every

The `every` validator is built into Strickland. And it has a couple additional features not illustrated
in the implementation above.

The `every` function also takes `validatorProps` that are combined with the `validationProps`
supplied to every validator. This allows properties common to all validators to be supplied
at the time of creation.

``` jsx
const mustExistWithLength5 = every(
    [
        required(),
        maxLength(2)
    ],
    {message: 'Must have a length of at least 5'}
);

const result = validate(mustExistWithLength5, '1234');
```

Additionally, the `every` validator adds a prop to the result that provides the detailed validation results
of every validator that was validated in the array of validators. Validators that were not executed
because of validation failing early will be omitted from this output property. The output property is named
`every` to match the name of the validator (this is a common pattern in Strickland).

Here is an example illustrating the `every` property.

``` jsx
import validate, {every, required, minLength, maxLength} from 'strickland';

const mustExistWithLength5 = every([
    required({message: 'Required'}),
    minLength(5, {message: 'Must have a length of at least 5'}),
    maxLength(10, {message: 'Must have a length no greater than 10'})
]);
const result = validate(mustExistWithLength5, '1234');

/*
result = {
    isValid: false,
    value: '1234',
    required: true,
    minLength: 5,
    message: 'Must have a length of at least 5',
    every: [
        {
            isValid: true,
            value: '1234',
            required: true,
            message: 'Required'
        },
        {
            isValid: false,
            value: '1234',
            minLength: 5,
            message: 'Must have a length of at least 5'
        }
    ]
}
*/
```

There are a few notable characteristics of this result:

1. The properties from each executed validator are added to the top-level result
    * The `required` validator added the `required: true` property to the result
    * The `minLength` validator added the `minLength: 5` property to the result
1. Property collisions are resolved using last-in-wins
    * In this example, the `message` from the `required` validator was replaced with the `message` from the `minLength` validator
    * This allows the message to reflect the deepest validation result in the array
1. Once validation fails for a validator, no further validation is performed
    * The `maxLength` validator was not executed
    * The props from the `maxLength` validator are not included on the result
    * The `every` array in the result does not include an item for the `maxLength` validator
1. The top-level `isValid` prop on the result reflects the overall validation result

### each

Strickland also provides an `each` validator. The `each` validator operates over an array and it
will only return a valid result if each and every validator in the array is valid. But `each` has
a significant difference from `every`: `each` will always execute every validator, regardless
of previous results. You can use `each` if all validators are safe to execute and you need to
know all validator results, even if some are invalid.

``` jsx
import validate, {
    each, required, minLength, maxLength
} from 'strickland';

const mustExistWithLength5 = each([
    required({message: 'Required'}),
    minLength(5, {message: 'Must have a length of at least 5'}),
    maxLength(10, {message: 'Must have a length no greater than 10'})
]);
const result = validate(mustExistWithLength5, '1234');

/*
result = {
    isValid: false,
    value: '1234',
    required: true,
    minLength: 5,
    message: 'Must have a length no greater than 10',
    each: [
        {
            isValid: true,
            value: '1234',
            required: true,
            message: 'Required'
        },
        {
            isValid: false,
            value: '1234',
            minLength: 5,
            message: 'Must have a length of at least 5'
        },
        {
            isValid: true,
            value: '1234',
            maxLength: 10,
            message: 'Must have a length no greater than 10'
        }
    ]
}
*/
```

### some

Strickland also provides an `some` validator. The `some` validator also operates over an array
of validators and it behaves similarly to `every`, except that it will exit as soon as it encounters
a *valid* result. If any of the validators in the array are valid, then the overall result will
be valid.

``` jsx
import validate, {
    some, required, minLength, maxLength
} from 'strickland';

const mustExistWithLength5 = some([
    required({message: 'Required'}),
    maxLength(10, {message: 'Must have a length no greater than 10'}),
    minLength(5, {message: 'Must have a length of at least 5'})
]);
const result = validate(mustExistWithLength5, '');

/*
result = {
    isValid: true,
    value: '',
    required: true,
    maxLength: 10,
    message: 'Must have a length no greater than 10',
    some: [
        {
            isValid: false,
            value: '',
            required: true,
            message: 'Required'
        },
        {
            isValid: true,
            value: '',
            maxLength: 10,
            message: 'Must have a length no greater than 10'
        }
    ]
}
*/
```

## Validating Objects

We've demonstrated quite a bit of flexibility validating single values with Strickland, including seeing a
glimse of composition using the `every` validator. But every application needs to validate objects. Let's see
how Strickland can do this.

We will start by illustrating what object validation might look like with no additional Strickland features.
This example will validate a person's first name, last name, and birth year.

``` jsx
import validate, {
    required, length, range, every
} from 'strickland';

// Define the rules for first name, last name, and birthYear
const validateProps = {
    firstName: every([required(), length(2, 20)]),
    lastName: every([required(), length(2, 20)]),
    birthYear: range(1900, 2018)
};

// Create a person
const person = {
    firstName: 'Stanford',
    lastName: 'Strickland',
    birthYear: 1925
};

// Validate the person's properties
const props = {
    firstName: validate(validateProps.firstName, person.firstName),
    lastName: validate(validateProps.lastName, person.lastName),
    birthYear: validate(validateProps.birthYear, person.birthYear)
};
```

With this example, we have very primitive object property validation. The props output includes the validation
results for each property, but there isn't anything providing a top-level `isValid` prop on the results.
Let's add that in.

``` jsx

// Validate the person's properties
const props = {
    firstName: validate(rules.firstName, person.firstName),
    lastName: validate(rules.lastName, person.lastName),
    birthYear: validate(rules.birthYear, person.birthYear)
};

// Create a top-level result including the results from the props
const result = {
    props,
    isValid: (
        props.firstName.isValid &&
        props.lastName.isValid &&
        props.birthYear.isValid
    ),
    value: person
};
```

The top-level result also includes the `value` to be consistent with the output of other validators.

At this point, we can see a pattern where we would want a validator to iterate over the properties
that have validators, validate each of those properties, and compose a final validation result for
all props. Indeed, Strickland has such a validator built-in called `props`.

### props

The `props` validator performs validation on every object property for which validators are defined. The
validators are supplied as an object with the shape matching the object. Here's an example for validating
the person we used above showing what the detailed result properties are.

``` jsx
import validate, {
    props, required, length, range, every
} from 'strickland';

// Define the rules for first name, last name, and birthYear
const validatePersonProps = props({
    firstName: every([required(), length(2, 20)]),
    lastName: every([required(), length(2, 20)]),
    birthYear: range(1900, 2018)
});

// Create a person
const person = {
    firstName: 'Stanford',
    lastName: 'Strickland',
    birthYear: 1925
};

const result = validate(validatePersonProps, person);

/*
result = {
    isValid: true,
    value: person,
    props: {
        firstName: {
            isValid: true,
            value: 'Stanford',
            required: true,
            minLength: 2,
            maxLength: 20,
            every: [
                {
                    isValid: true,
                    value: 'Stanford',
                    required: true
                },
                {
                    isValid: true,
                    value: 'Stanford',
                    minLength: 2,
                    maxLength: 20
                }
            ]
        },
        lastName: {
            isValid: true,
            value: 'Strickland',
            required: true,
            minLength: 2,
            maxLength: 20,
            every: [
                {
                    isValid: true,
                    value: 'Strickland',
                    required: true
                },
                {
                    isValid: true,
                    value: 'Strickland',
                    minLength: 2,
                    maxLength: 20
                }
            ]
        },
        birthYear: {
            isValid: true,
            value: 1925,
            min: 1900,
            max: 2018
        }
    }
}
*/
```

## Advanced Object Validation

With the composable nature of Strickland, it is very easy to perform advanced object validation. If our
person object might be null in the input, we could use `required` to validate that it isn't null. And
since validators are just functions, we could even write a custom validator to ensure that a person
named 'Stanford Strickland' must be born in 1925.

``` jsx
import validate, {
    props, required, length, range, every
} from 'strickland';

// Define the rules for first name, last name, and birthYear
const validatePersonProps = props({
    firstName: every([required(), length(2, 20)]),
    lastName: every([required(), length(2, 20)]),
    birthYear: range(1900, 2018)
});

function stanfordStricklandBornIn1925(person) {
    if (!person) {
        // If there's no person provided, return valid and
        // rely on `required` to ensure a person exists
        return true;
    }

    const {firstName, lastName} = person;

    if (firstName === 'Stanford' && lastName === 'Strickland') {
        return (person.birthYear === 1925);
    }

    return true;
}

const validatePerson = every([
    required(),
    validatePersonProps,
    stanfordStricklandBornIn1925
]);

// Create a person
const person = {
    firstName: 'Stanford',
    lastName: 'Strickland',
    birthYear: 1925
};

const result = validate(validatePerson, person);
```

In this example, the following will be validated (in this order):

1. The `person` is not empty
1. The `person` props are validated:
    1. `firstName` is not empty
    1. `firstName` has a length between 2 and 20
    1. `lastName` is not empty
    1. `lastName` has a length between 2 and 20
    1. `birthYear` is between 1900 and 2018
1. `stanfordStricklandBornIn1925` is validated

Here are some notes should anything have been invalid:

1. If the `person` had been empty, neither the props nor `stanfordStricklandBornIn1925` would have been validated
1. If the `firstName` prop had been empty, its length would not have been validated
1. If the `lastName` prop had been empty, its length would not have been validated
1. If the `firstName`, `lastName`, or `birthYear` props had been invalid, `stanfordStricklandBornIn1925` would not have been validated

### Nested Objects

This composition ability for combining validators together on props and objects opens up complex possibilities.
Another great example is nested objects.

``` jsx
import validate, {
    props, required, length, range, every
} from 'strickland';

const validatePerson = props({
    name: every([required(), length(5, 40)]),
    address: props({
        street: props({
            number: every([required(), range(1, 99999)]),
            name: every([required(), length(2, 40)])
        }),
        city: required(),
        state: every([required(), length(2, 2)])
    })
});

const person = {
    name: 'Marty McFly',
    address: {
        street: {
            number: 9303,
            name: 'Lyon Drive'
        },
        city: 'Hill Valley',
        state: 'CA'
    }
};

const result = validate(validatePerson, person);
```

## Object and Array Conventions

We defined early on that all validators must be functions in Strickland. This is technically true, but
because `props` and `every` are used so frequently to validate object properties and arrays of validators,
conventions are built into Strickland's `validate` function to automatically use `props` and `every`.

If a validator is not a function, but it is instead an array, it is assumed to be an array of validator
functions. This array will be wrapped with `every`.

If a validator is not a function nor an array, but it is an object, it is assumed to be an object defining
validators for object props. This object will be wrapped with `props`.

We can rewrite the example for validating a person's name and address more naturally.

``` jsx
import validate, {required, length, range} from 'strickland';

const validatePerson = {
    name: [required(), length(5, 40)],
    address: {
        street: {
            number: [required(), range(1, 99999)],
            name: [required(), length(2, 40)]
        },
        city: required(),
        state: [required(), length(2, 2)]
    }
};
```

There may be times when you do need to explicitly use `props` and `every` though. With the object and
array conventions, there is no way to pass validator props in that would apply at the object-level or
to all validators within the array. But it is quite easy to reintroduce the `props` or `every` wrapper
and pass props in after the object or array as seen previously.

## Async Validators

If you have wondered how async validators would work with Strickland, you will be delighted at how
simple they are. If a validator returns a `Promise`, then Strickland will return a `Promise` for
the validation result. When the validation result is resolved, any async validators will be resolved.

``` jsx
import validate from 'strickland';

function usernameIsAvailable(username) {
    if (!username) {
        return true;
    }

    return new Promise((resolve) => {
        if (username === 'marty') {
            resolve({
                isValid: false,
                message: `"${username}" is not available`
            });
        }

        resolve(true);
    });
}

validate(usernameIsAvailable, 'marty').then((result) => {
    /*
    result = {
        isValid: false,
        value: 'marty',
        message: '"marty" is not available'
    }
    */
});
```

When validation results are invalid, do not reject the promise. Instead, resolve the promise
with a validation result that is not valid. As usual, this can be done by returning `false` or
an object with `isValid: false`.

It is your responsibility to know if one of your validators could return a `Promise`; if so, then
you will always need to treat the result from `validate` as a `Promise`. If you are unsure if
`validate` is going to return a `Promise`, you can always safely use `Promise.resolve()` around
the validation results.

``` jsx
Promise.resolve(validate(validator, value)).then(handleValidationResult);
```

### Async Validator Arrays and Objects

As you likely guessed, the `every`, `props`, `each`, and `some` validators support async validators too.
That means you can compose async validators together with any other validators. If anywhere in your tree
of validators, a `Promise` is returned as a result, then the overall result will be a `Promise`.

The conventions for `every` and `props` still apply when async validators are in use. Here is
an example showing sync and async validators mixed together when nested objects and arrays.

``` jsx
import validate, {required, length} from 'strickland';

function validateCity(address) {
    if (!address) {
        return true;
    }

    return new Promise((resolve) => {
        const {city, state} = address;

        if (city === 'Hill Valley' && state !== 'CA') {
            resolve({
                isValid: false,
                message: 'Hill Valley is in California'
            });
        } else {
            resolve(true);
        }
    });
}

const validatePerson = {
    name: [
        required(),
        length(2, 20, {
            message: 'Name must be 2-20 characters'
        })
    ],
    username: [
        required(),
        length(2, 20),
        usernameIsAvailable
    ],
    address: [
        required({message: 'Address is required'}),
        {
            street: [required(), length(2, 40)],
            city: [required(), length(2, 40)],
            state: [required(), length(2, 2)]
        },
        validateCity
    ]
};

const person = {
    name: 'Marty McFly',
    username: 'marty',
    address: {
        street: '9303 Lyon Dr.',
        city: 'Hill Valley',
        state: 'WA'
    }
};

validate(validatePerson, person).then((result) => {
    /*
    result = {
        isValid: false,
        props: {
            name: {
                isValid: true,
                value: 'Marty McFly'
            },
            username: {
                isValid: false,
                value: 'marty',
                message: '"marty" is not available'
            },
            address: {
                isValid: false,
                message: 'Hill Valley is in California',
                props: {
                    street: {isValid: true},
                    city: {isValid: true},
                    state: {isValid: true}
                }
            }
        }
    }
    */
});
```

You can use async validators anywhere you want and the resolved results match the shape
you would expect if everything was executed synchronously.

#### props

The `props` validator on the other hand validates all props at once. This is possible
because one prop being invalid does not prevent other props from being validated. The `props`
validator result will not be resolved until all props have been validated, but the async
validators will be executed in parallel using `Promise.all()`. In the example above,
`usernameIsAvailable` and `validateCity` run in parallel.

#### every

The `every` validator retains its short-circuiting behavior when async results are returned.
Multiple async validators will be chained together such that the first async validator will
complete before the next async validator is executed. This lets you chain validators to prevent
subsequent validators from getting called if earlier validators are already invalid. But beware
that multiple async validators in an array would then have their execution times added up before
valid results can be returned.

#### each

The `each` validator behaves more like the `props` validator when async validation is needed.
Because `each` will never short-circuit based on validation results, it uses `Promise.all()`
to resolve each of the validators. Its async validators can therefore run in parallel, and
it may sometimes be beneficial to use `each` explicitly when performing multiple async
validations.

#### some

The `some` validator is similar to `every`; it short-circuits and therefore cannot run async
validators in parallel. The `some` validator will short-circuit and return a *valid* result
as soon as it encounters the first valid result. Async validators will therefore get
chained together and run in series until a valid result is found.

### Two-Stage Sync/Async Validation

When a validator returns a `Promise`, the `validate` function actually applies a convention for
the validation result. The `Promise` result is converted into a validation result object that
has an `async` prop with the `Promise` returned. This behavior is consistent with
how boolean results are handled--they are wrapped in results where the boolean value is used
as the `isValid` prop.

Because the handling of `Promise` results is just a convention, your validators can skip
that convention when needed. Instead of directly returning a `Promise`, a validator can return
a result with an `async` prop that represents additional validation to be performed
asynchronously. Additional props can be included alongside `resolveProp` for richer results.

As seen above though, `validate` will directly return a `Promise` if any validation returns
a `Promise`. This is due to a second convention that `validate` applies: if the validation
result includes an `async` result prop, that `Promise` will be directly returned.
However, callers to `validate` can also skip that convention. To do so, pass a validation
prop of `async: false` and `validate` will return the actual result object
containing the `async` prop as the `Promise` to be resolved.

Understanding these conventions, it's possible to perform two-stage validation where the first
stage produces partial, synchronous validation; and the second stage performs complete,
asynchronous validation. The following example would allow a UI to render partial validation
results along with a progress indicator for the validation still executing. When the final
validation is complete, the UI would update to reflect the complete result.

``` jsx
import validate, {required, length} from 'strickland';

function checkUsernameAvailability(username) {
    if (!username) {
        // Return just a boolean - it will be
        // converted to a valid result
        return true;
    }

    // Return an initial result indicating the value is
    // not valid (yet), but validation is in progress
    return {
        isValid: false,
        message: `Checking availability of "${username}"...`,
        async: new Promise((resolve) => {

            if (username === 'marty') {

                // Produce an async result object with
                // a message
                resolve({
                    isValid: false,
                    message: `"${username}" is not available`
                });
            }

            // Produce an async result using just a boolean
            resolve(true);
        })
    };
}

const validateUser = {
    name: [required(), length(2, 20)],
    username: [required(), length(2, 20), checkUsernameAvailability]
};

const user = {
    name: 'Marty McFly',
    username: 'marty'
};

// Pass {async: false} to get immediate but partial results
const result = validate(validateUser, user, {async: false});

/*
result = {
    isValid: false,
    props: {
        name: {
            isValid: true,
            value: 'Marty McFly'
        },
        username: {
            isValid: false,
            value: 'marty',
            required: true,
            minLength: 2,
            maxLength: 20,
            message: 'Checking availability of "marty"...'
            async: Promise.prototype
        }
    },
    async: Promise.prototype
}
*/

result.async.then((asyncResult) => {
    /*
    asyncResult = {
        isValid: false,
        props: {
            name: {
                isValid: true,
                value: 'Marty McFly'
            },
            username: {
                isValid: false,
                value: 'marty',
                required: true,
                minLength: 2,
                maxLength: 20,
                message: '"marty" is not available',
                async: false
            }
        },
        async: false
    }
    */
});
```

## Summary

Strickland actually uses very few concepts to accomplish a great deal.

1. Validators are functions that take values and return results
1. Results can be `Boolean` values or objects with an `isValid` property
1. Validator factories are commonly used to build configurable validators
1. Validators and factories can receive props that get included in validation result objects
1. Validators can be composed together by writing validator functions that operate over validators
1. This pattern allows arrays and objects of validators to be validated easily
1. Even async validation layers on easily, with Promises being returned if needed

The design and implementation of Strickland ends up being fractal, with composition available
at every turn. Because validator functions are so simple, Strickland is a great framework on
which you can build the validator libraries you need for your application. And since Strickland
is pure JavaScript and not coupled to any other libraries or concepts, it can be used in any
JavaScript application.
