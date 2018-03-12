# Nested Objects

The composition ability for combining validators together on props and objects opens up complex possibilities. Another great example is nested objects.

``` jsx
import validate, {
    objectProps, required, length, range, every
} from 'strickland';

const validatePerson = objectProps({
    name: every([required(), length({minLength: 5, maxLength: 40})]),
    address: objectProps({
        street: objectProps({
            number: every([required(), range({min: 1, max: 99999})]),
            name: every([required(), length({minLength: 2, maxLength: 40})])
        }),
        city: required(),
        state: every([required(), length({minLength: 2, maxLength: 2})])
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

Objects can be nested without any limits on depth. And any type of validator can be used anywhere in the tree.
