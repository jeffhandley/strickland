var ValidationResult = require('../ValidationResult')

var Required = function(instance, property, errorMessage) {
    this.instance = instance
    this.property = property
    this.errorMessage = errorMessage

    this.validateValue = function(value) {
        if (!!!value) {
            return new ValidationResult(
                this.errorMessage, this.instance, this.property, false)
        }
    }

    this.validate = function() {
        return this.validateValue(this.instance[this.property])
    }
}

module.exports = Required