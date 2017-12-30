# Built-In Validator: props

The `props` validator performs validation on every object property for which validators are defined. The validators are supplied as an object with the shape matching the object.

## Parameters

The first parameter to the `props` validator factory is an object defining the properties to be validated on objects. These properties themselves have values that are validators. The second parameter is a `validatorContext` that is combined with the context supplied to every validator; this allows context common to all validators to be supplied once at the time of creation.

## Result Properties

* `props`: An object with properties matching those validated, with the values of the properties representing the validation results produced during validation

The `props` validator adds a `props` property to the validation result that provides the detailed validation results of every property that was validated in the object's validators. The validation result property is named `props` to match the name of the validator (this is a common pattern in Strickland).


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
