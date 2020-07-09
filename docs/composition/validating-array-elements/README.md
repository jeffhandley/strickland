# Validating Array Elements

Validators can easily validate scalar values, taking a single value and producing a validation result. It's common to need to validate arrays of values too, where every array element needs to be validated against a validator (or an array of validators).

While custom validators can easily be created for validating arrays and their elements, Strickland also provides a built-in [`arrayElements`](arrayelements.md) validator to make array element validation easy.
