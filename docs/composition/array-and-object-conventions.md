# Composition Conventions

We defined early on that all validators must be functions in Strickland. This is technically true, but because `every` and `objectProps` are used so frequently to validate arrays of validators and object properties, composition conventions are built into Strickland's `validate` function to automatically use `every` and `objectProps`.

If a validator is not a function, but it is instead an array, it is assumed to be an array of validator functions. This array will be wrapped with `every`.

If a validator is an object, it is assumed to be an object defining validators for object props. This object will be wrapped with `objectProps`.

We can rewrite the example for validating a person's name and address more naturally.

import validate, {arrayOf, required, length, range} from 'strickland';

const personValidator = [
    required(),
    {
        name: [required(), length(5, 40)],
        addresses: [required(), arrayOf([
            required(),
            {
                street: [
                    required(),
                    {
                        number: [required(), range(1, 99999)],
                        name: [required(), length(2, 40)]
                    }
                ],
                city: required(),
                state: [required(), length(2, 2)]
            }
        ])]
    }
];

const person = {
    name: 'Stanford Strickland',
    address: {
        city: 'Hill Valley',
        state: 'CA'
    }
};

const result = validate(personValidator, person);

// Result would be invalid because
// address does not have a street
```

There may be times when you do need to explicitly use `every` and `objectProps` though. With the object and array conventions, there is no way to pass validator props in that would apply at the object-level or to all validators within the array. But it is quite easy to reintroduce the `objectProps` or `every` wrapper and pass props in after the object or array as seen previously.
