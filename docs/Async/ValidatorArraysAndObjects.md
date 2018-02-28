# Async Validator Arrays and Objects

The `every`, `each`, `some`, and `props` validators support async validators too. You can compose async validators together with any other validators. Here is an example showing sync and async validators mixed together with nested objects and arrays.

``` jsx
import {validateAsync, required, length} from 'strickland';

function validateCity(address) {
    return new Promise((resolve) => {
        if (!address) {
            resolve(true);
        }

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

validateAsync(validatePerson, person).then((result) => {
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

You can use async validators anywhere you want and the resolved results match the shape you would expect if everything was executed synchronously. When `validateAsync` is resolved, all async validators will be resolved.

## every

The `every` validator retains its short-circuiting behavior when async results are returned.
Multiple async validators will be chained together such that the first async validator will
complete before the next async validator is executed. This lets you chain validators to prevent
subsequent validators from getting called if earlier validators are already invalid. But beware
that multiple async validators in an array would then have their execution times added up before
valid results can be returned.

## each

The `each` validator resolves all async prop validators in parallel. Because `each` will never short-circuit based on validation results, it uses `Promise.all()` to resolve the validators. Its async validators can therefore run in parallel, and it may sometimes be beneficial to use `each` explicitly when performing multiple async validations.

## some

The `some` validator is similar to `every`; it short-circuits and therefore cannot run async validators in parallel. The `some` validator will short-circuit and return a *valid* result as soon as it encounters the first valid result. Async validators will therefore get chained together and run in series until a valid result is found.

## props

The `props` validator resolves all async prop validators in parallel. This is possible because one prop being invalid does not prevent other props from being validated. The `props` validator result will not be resolved until all props have been validated, but the async validators will be executed in parallel using `Promise.all()`. In the example above, `usernameIsAvailable` and `validateCity` run in parallel.
