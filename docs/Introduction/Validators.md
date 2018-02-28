# Creating Validators

Strickland **validators** are pure functions that *accept values* and *return validation results*. Here is an extremely simple validator that validates that the value supplied is the letter 'A', returning the validation result as a boolean.

``` jsx
// As an arrow function
const letterA = (value) => (value === 'A');

// As a traditional function
function letterA(value) {
    return (value === 'A');
}
```
