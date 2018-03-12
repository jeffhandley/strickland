# Array and Object Conventions

We defined early on that all validators must be functions in Strickland. This is technically true, but because `every` and `props` are used so frequently to validate arrays of validators and object properties, conventions are built into Strickland's `validate` function to automatically use `every` and `props`.

If a validator is not a function, but it is instead an array, it is assumed to be an array of validator functions. This array will be wrapped with `every`.

If a validator is an object, it is assumed to be an object defining validators for object props. This object will be wrapped with `props`.

We can rewrite the example for validating a person's name and address more naturally.

``` jsx
import validate, {required, length, range} from 'strickland';

const validatePerson = [
    required(),
    {
        name: [required(), length({minLength: 5, maxLength: 40})],
        address: [
            required(),
            {
                street: [
                    required(),
                    {
                        number: [required(), range({min: 1, max: 99999})],
                        name: [required(), length({minLength: 2, maxLength: 40})]
                    }
                ],
                city: required(),
                state: [required(), length({minLength: 2, maxLength: 2})]
            }
        ]
    }
];

const person = {
    name: 'Stanford Strickland',
    address: {
        city: 'Hill Valley',
        state: 'CA'
    }
};

const result = validate(validatePerson, person);

// Result would be invalid because
// address does not have a street
```

There may be times when you do need to explicitly use `every` and `props` though. With the object and array conventions, there is no way to pass validator props in that would apply at the object-level or to all validators within the array. But it is quite easy to reintroduce the `props` or `every` wrapper and pass props in after the object or array as seen previously.
