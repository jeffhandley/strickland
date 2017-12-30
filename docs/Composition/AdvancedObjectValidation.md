# Advanced Object Validation

With the composable nature of Strickland, it is very easy to perform advanced object validation. If our person object might be null in the input, we could use `required` to validate that it isn't null. And since validators are just functions, we could even write a custom validator to ensure that a person named 'Stanford Strickland' must be born in 1925.

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

1. If the `person` was empty, neither the props nor `stanfordStricklandBornIn1925` would be validated
1. If the `firstName` prop was empty, its length would not be validated
1. If the `lastName` prop was empty, its length would not be validated
1. If the `firstName`, `lastName`, or `birthYear` props were invalid, `stanfordStricklandBornIn1925` would not be validated
