# Arrays of Objects

With the combination of Strickland's `objectProps` and `arrayElements` validators, it's easy to validate arrays of objects.

```jsx
import validate, {
    objectProps, arrayElements, required, length, range, every
} from 'strickland';

const personValidator = objectProps({
    name: every([required(), length(5, 40)]),
    addresses: arrayElements(
        every([
            required(),
            objectProps({
                street: objectProps({
                    number: every([required(), range(1, 99999)]),
                    name: every([required(), length(2, 40)])
                }),
                city: required(),
                state: every([required(), length(2, 2)])
            })
        ])
    )
});

const person = {
    name: 'Marty McFly',
    addresses: [
        {
            street: {
                number: 9303,
                name: 'Lyon Drive'
            },
            city: 'Hill Valley',
            state: 'CA'
        },
        null,
        {
            street: null,
            city: 'Hill Valley',
            state: 'CA'
        }
    ]
};

const result = validate(personValidator, person);
```

Objects can be nested without any limits on depth. And any type of validator can be used anywhere in the tree.

