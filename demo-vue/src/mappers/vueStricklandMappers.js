import { getValidationMessage, getValidationClassName } from '../../../demo/src/formValidator';

export default function mapFormFieldValidationStates (fieldNames = []) {
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
