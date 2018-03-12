# Built-In Validator: props

The `props` validator performs validation on every object property for which validators are defined. The validators are supplied as an object with the shape matching the object.

## Parameters

The first parameter to the `props` validator factory is an object defining the properties to be validated on objects. Validator props can also be supplied either as an object or as a function that accepts context and returns a validator props object.

``` jsx
import {props} from 'strickland';

const validateProps = props({
    firstName: every([required(), length({minLength: 2, maxLength: 20})]),
    lastName: every([required(), length({minLength: 2, maxLength: 20})]),
    birthYear: range({min: 1900, max: 2018})
}, {
    message: 'The person must be valid'
});
```

## Validation Context

When validation context needs to be supplied to specific validators, a `props` context can be used with a shape matching how the context should be applied.

``` jsx
import {props} from 'strickland';

const validateProps = props({
    firstName: every([
        required(),
        length((context) => ({
            minLength: context.minLength,
            maxLength: context.maxLength
        }))
    ]),
    lastName: every([
        required(),
        length((context) => ({
            minLength: context.minLength,
            maxLength: context.maxLength
        }))
    ]),
    birthYear: range((context) => ({
        min: context.min,
        max: context.max
    }))
}, {
    message: 'The person must be valid'
});

// Create a person
const person = {
    firstName: 'Stanford',
    lastName: 'Strickland',
    birthYear: 1925
};

const result = validate(validateProps, person, {
    props: {
        firstName: {
            minLength: 5,
            maxLength: 20
        },
        lastName: {
            minLength: 8,
            maxLength: 23
        },
        birthYear: {
            min: 1900,
            max: 2018
        }
    }
});
```

## Result Properties

* `props`: An object with properties matching those validated, with the values of the properties representing the validation results produced during validation

The `props` validator adds a `props` property to the validation result with validation results of every property that was validated in the object's validators. The validation result property is named `props` to match the name of the validator (this is a common pattern in Strickland).


``` jsx
import validate, {
    props, required, length, range, every
} from 'strickland';

// Define the rules for first name, last name, and birthYear
const validatePersonProps = props({
    firstName: every([required(), length({minLength: 2, maxLength: 20})]),
    lastName: every([required(), length({minLength: 2, maxLength: 20})]),
    birthYear: range({min: 1900, max: 2018})
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
                maxLength: 25,
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
                        maxLength: 25
                    }
                ]
            },
            lastName: {
                isValid: true,
                value: 'Strickland',
                required: true,
                minLength: 2,
                maxLength: 30,
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
                        maxLength: 30
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
