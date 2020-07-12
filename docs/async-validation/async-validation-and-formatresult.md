# Async Validation and formatResult

We learned earlier that `formatResult` can be used to wrap a validator and augment or transform its validation result. This is true for async validation results as well--`formatResult` handles both synchronous and asynchronous results.

By simply wrapping a validator with `formatResult`, the result formatter function will be called for both the synchronous and the asynchronous results. The two-stage sync/async validation results can be differentiated from one another if needed. If the result contains a `validateAsync` result prop \(that is a function\), then the result represents the first stage, synchronous validation result. If the result does not contain a `validateAsync` result prop, then all asynchronous validation has been completed.

