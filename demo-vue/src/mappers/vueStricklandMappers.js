import { getValidationMessage, getValidationClassName } from '../../../demo/src/helpers';

export default function mapFormFieldValidationStates (form) {
  var fieldNames = Object.keys(form);
  return fieldNames.reduce((obj, fieldName) => {
    const computedPropName = fieldName + 'State';
    const computedProp = {
      get () {
        return {
          validationClassName: getValidationClassName(this.form, this.validation, fieldName),
          validationMessage: getValidationMessage(this.validation, fieldName)
        };
      },
      set () { }
    };
    obj[computedPropName] = computedProp;
    return obj;
  }, {});
}
