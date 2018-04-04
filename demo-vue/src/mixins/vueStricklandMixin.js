import formValidator from '../../../demo/src/formValidator';

export const formValidationMixin = {
  methods: {
    handleAsyncFieldValidation (fieldName, asyncFieldResult) {
      this.validation = formValidator.updateFieldResults(this.validation, { [fieldName]: asyncFieldResult });
    },
    getDependents (fieldName) {
      return this.validationDependencies ? this.validationDependencies[fieldName] : null;
    },
    getDependentsNeedingRevalidation (dependents, validationResults) {
      return dependents
        ? Object.keys(validationResults).filter((field) => dependents.includes(field))
        : [];
    },
    stricklandOnInput (event) {
      let fieldName = event.target.name;

      // Determine which dependent fields have already been validated
      // and therefore need to be revalidated
      const dependentsNeedingRevalidation = this.getDependentsNeedingRevalidation(
        this.getDependents(fieldName),
        this.validation.form.validationResults
      );

      // Validate the form specifying the current field
      // as well as dependent fields that need re-validation
      const result = formValidator.validateFields(
        this.form,
        [fieldName, ...dependentsNeedingRevalidation],
        this.validation
      );

      // Pluck out the result for the current field
      const newFieldResult = result.form.validationResults[fieldName];
      const oldFieldResult = this.validation.form.validationResults[fieldName];
      const hasAsync = newFieldResult.validateAsync || (oldFieldResult && oldFieldResult.validateAsync);
      let value = this.form[fieldName];
      const hasChanged = oldFieldResult && value !== oldFieldResult.value;

      if (hasAsync || hasChanged) {
        this.validation = formValidator.updateFieldResults(this.validation, {[fieldName]: null});
      }

      // So long as there's no async validation, then if the new
      // result is valid or the previous result was already invalid, set the result
      if (!hasAsync && (newFieldResult.isValid || (oldFieldResult && !oldFieldResult.isValid))) {
        this.validation = result;
      }

      setTimeout(() => {
        let formAfterTimeout = this.form;
        let validationAfterTimeout = this.validation;

        // If after our idle timeout, the field hasn't yet changed and the field
        // still hasn't been validated
        if (newFieldResult.value === formAfterTimeout[fieldName] && !validationAfterTimeout.form.validationResults[fieldName]) {
          // Update the field's validation state to indicate that
          // async validation is underway
          this.validation = formValidator.updateFieldResults(validationAfterTimeout, {[fieldName]: newFieldResult});

          // Fire off async validation
          if (newFieldResult.validateAsync) {
            newFieldResult.validateAsync(() => this.form[fieldName])
              .then((result) => this.handleAsyncFieldValidation(fieldName, result))
              .catch((result) => { console.error(`Error on async validation for field: ${fieldName}.`, result); });
          }
        }
      }, 1000); // TODO: Make this configurable via data.validationTimeoutInSeconds or similar
    },
    stricklandOnFocusOut (event) {
      let fieldName = event.target.name;
      let value = this.form[fieldName];

      // Validate if the field has not been validated yet or the value has changed
      if (!this.validation.form.validationResults[fieldName] || this.validation.form.validationResults[fieldName].value !== value) {
        // Determine which dependent fields have already been validated
        // and therefore need to be revalidated
        const dependentsNeedingRevalidation = this.getDependentsNeedingRevalidation(
          this.getDependents(fieldName),
          this.validation.form.validationResults
        );

        // Validate the form specifying the current field
        // as well as dependent fields that need re-validated
        this.validation = formValidator.validateFields(
          this.form,
          [fieldName, ...dependentsNeedingRevalidation],
          this.validation
        );
      }

      // Pluck out the result for the current field
      const fieldResult = this.validation.form.validationResults[fieldName];

      // If the field needs async validation, fire it off
      if (fieldResult.validateAsync) {
        fieldResult.validateAsync(() => this.form[fieldName])
          .then((result) => this.handleAsyncFieldValidation(fieldName, result))
          .catch((result) => { console.error(`Error on async validation for field: ${fieldName}.`, result); });
      }
    }
  }
};

export default formValidationMixin;
