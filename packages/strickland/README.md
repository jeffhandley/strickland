# Strickland

Strickland is a JavaScript validation _framework_. It's pure JavaScript and while it works well
with React, Redux, or other libraries, Strickland is not coupled to any other library or application
type.

Strickland is a unique and robust approach to performing validation in JavaScript.

* It is *not* a type system and it does not interfere with how you create and manage data
* Instead, validation rules are defined separately from the data
* While Strickland can be used within the UI layer (including React components), it is not limited to use within UI
* Universal applications can share validators across both client-side and server-side validation
* With its extensibility, Strickland supports complex scenarios in large line-of-business applications

## Validation Patterns

Strickland can validate scalar values or objects. Objects can have nested objects within them and rules
defined for any part of the shape. Validations rules are defined as simple functions that
return either boolean values or result objects.

## Scalar Value Validation

Scalar values can be validated very easily. Validators are defined separately from the data and the
`validate` function from Strickland will execute the validators.

``` jsx
import validate, {required} from 'strickland';

const name = 'Stanford';
const rules = required({message: 'Name is required'});

const result = validate(rules, name);
// result = {isValid: true, message: 'Name is required', value: 'Stanford', parsedValue: 'Stanford'}
```

Multiple validators can be used by simply supplying an array of validator functions.

``` jsx
import validate, {required, minLength} from 'strickland';

const name = '  Stanford  ';
const rules = [
    required({message: 'Name is required'}),
    minLength(10, {message: 'Name must be at least 10 characters'})
];

const result = validate(rules, name);
// result = {isValid: false, message: 'Name must be at least 10 characters', value: '  Stanford  ', parsedValue: 'Stanford'}
// note that the required and minLength validators trim leading and trailing whitespace by default
```

Validator props are used heavily within Strickland, allowing for flexible and extensible usage composition. The `composite`
validator is not required for composing validators, but since it applies the supplied props to all validators, it makes
some scenarios simpler.

``` jsx
import validate, {required, minLength, maxLength, composite} from 'strickland';

const name = 'Stanford Strickland';
const rules = composite([required, minLength, maxLength], {
    message: 'Name must be between 8 and 24 characters'
});

const result = validate(rules, name);
// result = {isValid: true, message: 'Name must be between 8 and 24 characters', value: 'Stanford Strickland', parsedValue: 'Stanford Strickland'}
```

## Object Validation

Objects can be validated just as simply as scalar values. Objects are provided as the data and the rules can be either functions
that validate the object or the rules themselves can be an object with a shape matching the object properties to validate.

``` jsx
import validate, {required, maxLength} from 'strickland';

const person = {
    first: 'Stanford',
    last: 'Strickland',
    title: '',
    phrase: 'Slacker!'
};

const rules = {
    first: required({message: 'First name is required'}),
    last: required({message: 'Last name is required'}),
    title: required({message: 'Title is required'}),
    phrase: maxLength(20, {message: 'Phrase cannot exceed 20 characters'})
};

const result = validate(rules, person);

/*
    result = {
        isValid: false,
        value: {first: 'Stanford', last: 'Strickland', title: '', phrase: 'Slacker!'},
        results: {
            first: {
                isValid: true,
                message: 'First name is required',
                value: 'Stanford',
                parsedValue: 'Stanford'
            },
            last: {
                isValid: true,
                message: 'Last name is required',
                value: 'Strickland',
                parsedValue: 'Strickland'
            },
            title: {
                isValid: false,
                message: 'Title is required',
                value: '',
                parsedValue: ''
            },
            phrase: {
                isValid: true,
                maxLength: 20,
                message: 'Phrase cannot exceed 20 characters',
                value: 'Slacker!',
                parsedValue: 'Slacker!'
            }
        }
    }
*/
```

Objects can also be validated using custom validator functions that inspect the entire object. Those functional validators
can even be composed with object shape validation and arrays of validators.

``` jsx
import validate, {required, maxLength} from 'strickland';

const person = {
    first: 'Gerald',
    last: 'Strickland',
    title: 'Principal',
    phrase: 'Slacker!'
};

function validatePerson(person) {
    const {first, last, title} = person;

    if (last === 'Strickland' && title === 'Principal') {
        if (first !== 'Stanford') {
            return {
                isValid: false,
                message: 'Principal Strickland was verified to have the first name of Stanford, despite some references to him as Gerald'
            };
        }
    }

    return true;
}

const rules = [
    {
        first: required({message: 'First name is required'}),
        last: required({message: 'Last name is required'}),
        title: required({message: 'Title is required'}),
        phrase: maxLength(20, {message: 'Phrase cannot exceed 20 characters'})
    },
    validatePerson
];

const result = validate(rules, person);
```

In the above example, the `validatePerson` validator will only be called if the object validation is successful, meaning all fields
are valid.
