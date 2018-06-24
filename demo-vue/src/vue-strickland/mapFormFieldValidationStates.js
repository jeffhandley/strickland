import classnames from 'classnames';

export default function mapFormFieldValidationStates (form) {
  var fieldNames = Object.keys(form);
  return fieldNames.reduce((obj, fieldName) => {
    obj[fieldName + 'State'] = {
      get () {
        return {
          // value: this[fieldName],
          validationClassName: getValidationClassName(this.form, this.validation, fieldName),
          validationMessage: getValidationMessage(this.validation, fieldName)
        };
      },
      set (value) {
        // this.form[fieldName].value = value;
      }
    };
    return obj;
  }, {});
}

function getValidationClassName (form, validation, fieldName) {
  const fieldValidation = validation && validation.form && validation.form.validationResults[fieldName];

  // TODO: Make configurable via plugin
  return classnames({
    'validation-value': !!form[fieldName],
    'validation-valid': fieldValidation && fieldValidation.isValid,
    'validation-async': fieldValidation && fieldValidation.validateAsync,
    'validation-invalid': fieldValidation && !fieldValidation.isValid && !fieldValidation.validateAsync
  });
}

function getValidationMessage (validation, fieldName) {
  const fieldValidation = validation && validation.form && validation.form.validationResults[fieldName];
  const {isValid, message, validMessage} = fieldValidation || {};

  if (isValid) {
    return validMessage;
  }

  return message;
}
