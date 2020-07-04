# Validating Objects

We've demonstrated quite a bit of flexibility validating single values with Strickland, including how arrays of validators can be composed together. But every application needs to validate objects. Let's see how Strickland can do this.

We will start by illustrating what object validation looks like with no additional Strickland features. This example will validate a person's first name, last name, and birth year.

```jsx
import validate, {
    required, length, range, every
} from 'strickland';

// Define the rules for first name, last name, and birthYear
const personValidator = {
    firstName: every([
        required(),
        length(2, 20)
    ]),
    lastName: every([
        required(),
        length(2, 20)
    ]),
    birthYear: range(1900, 2018)
};

// Create a person
const person = {
    firstName: 'Stanford',
    lastName: 'Strickland',
    birthYear: 1925
};

// Validate the person's properties
const personResult = {
    firstName: validate(personValidator.firstName, person.firstName),
    lastName: validate(personValidator.lastName, person.lastName),
    birthYear: validate(personValidator.birthYear, person.birthYear)
};
```

With this example, we have very primitive object property validation. The `personResult` output includes the validation results for each property, but there isn't anything providing a top-level `isValid` prop on the results. Let's add that in.

```jsx
// Validate the person's properties
const personResult = {
    firstName: validate(rules.firstName, person.firstName),
    lastName: validate(rules.lastName, person.lastName),
    birthYear: validate(rules.birthYear, person.birthYear)
};

// Create a top-level result including the results from personResult
const result = {
    personResult,
    isValid: (
        personResult.firstName.isValid &&
        personResult.lastName.isValid &&
        personResult.birthYear.isValid
    ),
    value: person
};
```

The top-level result also includes the `value` to be consistent with the output of other validators.

At this point, we can see a pattern where we would want a validator to iterate over the properties that have validators, validate each of those properties, and compose a final validation result for all props. Indeed, Strickland has such a validator built-in called `objectProps`.

