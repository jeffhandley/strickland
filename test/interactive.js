var Required = require('../src/validators/Required')

var instance = {
    firstName: null
}

instance.__validators = [
    new Required(instance, 'firstName', 'First Name is Required')
]

console.log('FirstName/Required ("Jeff"):', instance.__validators[0].validateValue("Jeff"))
console.log('FirstName/Required (""):', instance.__validators[0].validateValue(""))

console.log('FirstName/Required (Current Value = "' + instance.firstName + '"', instance.__validators[0].validate())
    instance.firstName = "Jeff"
console.log('FirstName/Required (Current Value = "' + instance.firstName + '"', instance.__validators[0].validate())
    