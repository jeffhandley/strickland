# Composition and formatResult

We learned about [`formatResult`](https://github.com/jeffhandley/strickland/tree/8a3b29a7273e6ee6f0d3945a170af06068918227/extensibility/formatresult.md) earlier. That validator wrapper provides an easy way to augment or transform the `objectProps` and `arrayElements` validation results to match the shape your application needs.

In the following example, `formatResult` is used to create a `validationErrors` validation result prop. The `validationErrors` value is flattened array of all validation errors existing in an object or array graph.

```jsx
import validate, {arrayElements, formatResult} from 'strickland';

const withValidationErrors = (result) => {
    const validationErrors = [];

    function addErrorsFromObjectProps(resultObjectProps, parentPath) {
        if (resultObjectProps) {
            Object.keys(resultObjectProps)
                // for each invalid prop, get that prop's result
                .map((propName) => ({
                    ...resultObjectProps[propName],
                    propName
                }))

                // recursively add errors
                .forEach(({propName, ...nestedResult}) => {
                    const propPath = [...parentPath, propName];

                    addErrorsFromResult({
                        ...nestedResult,
                        propPath
                    });
                });
        }
    }

    function addErrorsFromArrayElements(resultArrayElements, parentPath) {
        if (resultArrayElements) {
            // recursively add errors
            resultArrayElements.forEach((nestedResult, arrayElement) => {
                const propPath = [...parentPath, arrayElement];

                addErrorsFromResult({
                    ...nestedResult,
                    propPath
                });
            });
        }
    }

    function addErrorsFromResult(nestedResult) {
        if (!nestedResult.isValid) {
            const {
                objectProps,
                arrayElements,
                propPath = [],
                ...errorResult
            } = nestedResult;
            
            // omit the `objectProps` and `arrayElements`
            // result props but include `propPath`
            validationErrors.push({propPath, ...errorResult});

            addErrorsFromObjectProps(objectProps, propPath);
            addErrorsFromArrayElements(arrayElements, propPath);
        }
    }

    addErrorsFromResult(result);

    return {
        ...result,
        validationErrors
    };
};

const validateWithErrors = formatResult(withValidationErrors, {
    name: required(),
    addresses: [required(), minLength(1), arrayElements({
        addressType: required(),
        street: [required(), {
            number: required(),
            name: required()
        }],
        city: [required()],
        state: [required(), length(2, 2)],
        postal: [required(), length(5, 5)]
    })]
});

const data = {
    name: 'Marty',
    addresses: [
        {
            addressType: 'Home',
            street: {
                number: 9303,
                name: 'Lyon Drive'
            },
            city: 'Hill Valley',
            state: 'CA'
        },
        {
            addressType: 'Work'
        }
    ]
};

const result = validate(validateWithErrors, data);

expect(result).toMatchObject({
    validationErrors: [
        expect.objectContaining({
            value: expect.objectContaining({
                name: 'Marty',
                addresses: expect.any(Array)
            })
        }),
        expect.objectContaining({
            propPath: ['addresses']
        }),
        expect.objectContaining({
            propPath: ['addresses', 0],
            value: expect.objectContaining({
                addressType: 'Home'
            })
        }),
        expect.objectContaining({
            propPath: ['addresses', 0, 'postal'],
            required: true
        }),
        expect.objectContaining({
            propPath: ['addresses', 1],
            value: expect.objectContaining({
                addressType: 'Work'
            })
        }),
        expect.objectContaining({
            propPath: ['addresses', 1, 'street'],
            required: true
        }),
        expect.objectContaining({
            propPath: ['addresses', 1, 'city'],
            required: true
        }),
        expect.objectContaining({
            propPath: ['addresses', 1, 'state'],
            required: true
        }),
        expect.objectContaining({
            propPath: ['addresses', 1, 'postal'],
            required: true
        })
    ]
});

/*
    // Most result props are omitted for illustration
    // of the validationErrors contents
    result = {
        isValid: false,
        // objectProps,
        // value,
        validationErrors: [
            {
                value: {
                    name: 'Marty',
                    addresses: [/* ... */]
                })
            },
            {
                propPath: ['addresses']
            },
            {
                propPath: ['addresses', 0],
                value: {
                    addressType: 'Home'
                }
            },
            {
                propPath: ['addresses', 0, 'postal'],
                required: true
            },
            {
                propPath: ['addresses', 1],
                value: {
                    addressType: 'Work'
                }
            },
            {
                propPath: ['addresses', 1, 'street'],
                required: true
            },
            {
                propPath: ['addresses', 1, 'city'],
                required: true
            },
            {
                propPath: ['addresses', 1, 'state'],
                required: true
            },
            {
                propPath: ['addresses', 1, 'postal'],
                required: true
            }
        ]
    }
*/
```

