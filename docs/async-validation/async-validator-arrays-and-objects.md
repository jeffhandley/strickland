# Async Validator Arrays and Objects

The `every`, `all`, `some`, `arrayElements`, and `objectProps` validators support async validators too. You can compose async validators together with any other validators. Here is an example showing sync and async validators mixed together with nested objects and validator arrays.

```jsx
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
        length({
            minLength: 2,
            maxLength: 20,
            message: 'Name must be 2-20 characters'
        })
    ],
    username: [
        required(),
        length(2, 20),
        usernameIsAvailable
    ],
    address: [
        every([required(), minLength(1)], {message: 'At least 1 address is required'}),
        arrayElements([
            required({message: 'Address is required'}),
            {
                street: [required(), length(2, 40)],
                city: [required(), length(2, 40)],
                state: [required(), length(2, 2)]
            },
            validateCity
        ])
    ]
};

const person = {
    name: 'Marty McFly',
    username: 'marty',
    address: [
        {
            street: '9303 Lyon Dr.',
            city: 'Hill Valley',
            state: 'WA'
        }
    ]
};

validateAsync(validatePerson, person).then((result) => {
/*
    result = {
        isValid: false,
        objectProps: {
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
                arrayElements: [
                    {
                        isValid: false,
                        message: 'Hill Valley is in California',
                        objectProps: {
                            street: {isValid: true},
                            city: {isValid: true},
                            state: {isValid: true}
                        }
                    }
                ]
            }
        }
    }
*/
});
```

You can use async validators anywhere you want and the resolved results match the shape you would expect if everything was executed synchronously. When `validateAsync` is resolved, all async validators will be resolved.

### every

The `every` validator retains its short-circuiting behavior when async results are returned. Multiple async validators will be chained together such that the first async validator will complete before the next async validator is executed. This lets you chain validators to prevent subsequent validators from getting called if earlier validators are already invalid. But beware that multiple async validators in an array would then have their execution times added up before valid results can be returned.

### all

The `all` validator resolves all async prop validators in parallel. Because `all` will never short-circuit based on validation results, it uses `Promise.all()` to resolve the validators. Its async validators can therefore run in parallel, and it may sometimes be beneficial to use `all` explicitly when performing multiple async validations.

### some

The `some` validator is similar to `every`; it short-circuits and therefore cannot run async validators in parallel. The `some` validator will short-circuit and return a _valid_ result as soon as it encounters the first valid result. Async validators will therefore get chained together and run in series until a valid result is found.

### arrayElements

The `arrayElements` validator resolves all array element validation in parallel. This is possible because all array elements are validated independently of each other, with no one element being invalid affecting the validation of other elements. The `arrayElements` validator result will not be resolved until all array elements have been validated, but the async validators will be executed in parallel using `Promise.all()`. It is possible for validators to conditionally require async validation, which leads to the possibility of some array elements being validated synchronously and others required async validation.

### objectProps

The `objectProps` validator resolves all async prop validators in parallel. This is possible because one prop being invalid does not prevent other props from being validated. The `objectProps` validator result will not be resolved until all props have been validated, but the async validators will be executed in parallel using `Promise.all()`. In the example above, `usernameIsAvailable` and `validateCity` run in parallel.

