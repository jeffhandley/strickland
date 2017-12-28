# Creating Validators

Strickland **validators** are pure functions that *accept values* and *return validation results*. Here is an extremely simple validator that validates that the value supplied is the letter 'A'.

``` jsx
function letterA(value) {
    return (value === 'A');
}
```
