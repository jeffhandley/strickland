var ValidationResult = function(message, instance, properties, isWarning) {
    this.message = message
    this.instance = instance
    this.properties = Array.isArray(properties) ? properties : [ properties ]
    this.isWarning = !!isWarning
}

module.exports = ValidationResult