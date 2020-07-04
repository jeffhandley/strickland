# Async Form Validation

Async validation works naturally with the `form` validator. Any validator within the form validation can use async validation. As is seen with `objectProps` and other composition validators, an async validator within a form will result in a `validateAsync` function on the validation result.

## Field-Level Async Validation

By default, the `validateAsync` function returned on the validation result will resolve async validation for all fields that have remaining async validation. But, the `validateAsync` function also accepts a context parameter that allows specific fields to be resolved using the same `form.fields` behavior defined for synchronous form validation.

```jsx
// Execute async validation only for the username field
const asyncContext = {
    form: {
        fields: ['username']
    }
};

result.validateAsync(formValues, asyncContext);
```

## Two-Stage Validation

[Two-Stage Validation](../async/twostagevalidation.md) is commonly used with forms where standard validation occurs synchronously with results immediately rendered, but async validation that calls an API will be rendered when the response comes back.
