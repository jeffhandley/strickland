import validate from 'strickland';
import mapFormFieldValidationStates from './mapFormFieldValidationStates';
import mapFormStateToStore from './mapFormStateToStore';
import formStateBuilder from './formStateBuilder';
import * as utils from './utils';

const formMixinBase = {
  computed: {
    vueStricklandIsValid: () => this.validation && this.validation.isValid
  },
  methods: {
    vueStricklandValidateAsync (fieldResult, fieldName) {
      this.logValidation(`vueStrickland:validateAsync method triggered for field: '${fieldName}'.`);
      fieldResult.validateAsync(() => this.form[fieldName])
        .then((result) => {
          this.validation = this.validator.updateFieldResults(this.validation, { [fieldName]: result });
        })
        .catch((result) => {
          console.error(`Error on async validation for field: ${fieldName}.`, result);
        });
    },
    vueStricklandGetDependentsNeedingRevalidation (fieldName, validationResults) {
      let dependents = this.validationDependencies ? this.validationDependencies[fieldName] : null;
      return dependents
        ? Object.keys(validationResults).filter((field) => dependents.includes(field))
        : [];
    },
    vueStricklandOnChange (event, sender) {
      console.log('vueStrickland:onChange has been called', event, sender);
      if (utils.shouldUseChangeEvent(event.target)) {
        console.log('vueStrickland:onChange, handling');
        utils.shouldUseChangeEventOnDelay(event.target)
          ? this.vueStricklandHandleChangeAfterDelay(event) // TODO: Test out with <select multiple>...</select>
          : this.vueStricklandHandleChangeImmediately(event);
      }
    },
    vueStricklandOnInput (event) {
      if (utils.shouldUseChangeEvent(event)) {
        console.log('vueStrickland:onInput, rejecting');
        return;
      }

      this.vueStricklandHandleChangeAfterDelay(event);
    },
    vueStricklandOnFocusOut (event) {
      if (!utils.isFieldFocusOut(event.target)) {
        console.log('vueStrickland:onFocusOut, rejecting as isn\'t field focusout');
        return;
      }

      if (utils.shouldUseChangeEvent(event.target)) {
        console.log('vueStrickland:onFocusOut, rejecting as should use change event');
        return;
      }

      this.vueStricklandHandleChangeImmediately(event);
    },
    vueStricklandHandleChangeAfterDelay (event) {
      let fieldName = event.target.name;
      if (!fieldName) {
        return;
      }

      this.logValidation(`vueStrickland:handleChangeafterDelay method triggered by field: '${fieldName}'.`);

      // Determine which dependent fields have already been validated
      // and therefore need to be revalidated
      const dependentsNeedingRevalidation = this.vueStricklandGetDependentsNeedingRevalidation(
        fieldName,
        this.validation.form.validationResults
      );

      // Validate the form specifying the current field
      // as well as dependent fields that need re-validation
      const result = this.validator.validateFields(
        this.form,
        [fieldName, ...dependentsNeedingRevalidation],
        this.validation
      );

      // Pluck out the result for the current field
      const newFieldResult = result.form.validationResults[fieldName];
      const oldFieldResult = this.validation.form.validationResults[fieldName];
      const hasAsync = newFieldResult.validateAsync || (oldFieldResult && oldFieldResult.validateAsync);
      const hasChanged = oldFieldResult && this.form[fieldName] !== oldFieldResult.value;

      if (hasAsync || hasChanged) {
        this.validation = this.validator.updateFieldResults(this.validation, {[fieldName]: null});
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
          this.validation = this.validator.updateFieldResults(validationAfterTimeout, {[fieldName]: newFieldResult});

          // Fire off async validation
          if (newFieldResult.validateAsync) {
            this.vueStricklandValidateAsync(newFieldResult, fieldName);
          }
        }
      }, 1000); // TODO: Make this configurable via data.validationTimeoutInSeconds or similar
    },
    vueStricklandHandleChangeImmediately (event) {
      let fieldName = event.target.name;
      if (!fieldName) {
        return;
      }

      this.logValidation(`vueStrickland:handleChangeImmediately method triggered by field: '${fieldName}'.`);

      // Validate if the field has not been validated yet or the value has changed
      if (!this.validation.form.validationResults[fieldName] || this.validation.form.validationResults[fieldName].value !== this.form[fieldName]) {
        // Determine which dependent fields have already been validated
        // and therefore need to be revalidated
        const dependentsNeedingRevalidation = this.vueStricklandGetDependentsNeedingRevalidation(
          fieldName,
          this.validation.form.validationResults
        );

        // Validate the form specifying the current field
        // as well as dependent fields that need re-validated
        this.validation = this.validator.validateFields(
          this.form,
          [fieldName, ...dependentsNeedingRevalidation],
          this.validation
        );
      }

      // Pluck out the result for the current field
      const fieldResult = this.validation.form.validationResults[fieldName];

      // If the field needs async validation, fire it off
      if (fieldResult.validateAsync) {
        this.vueStricklandValidateAsync(fieldResult, fieldName);
      }
    },
    vueStricklandOnSubmit (event) {
      event.preventDefault();
      this.logValidation(`vueStrickland:onSubmit triggered called by: '${event.target}'.`);

      this.validation = validate(this.validator, this.form);

      if (this.validation.validateAsync) {
        this.validation.validateAsync(() => this.form)
          .then((result) => {
            this.validation = result;
            this.vueStricklandOnSubmitValidated(event);
          })
          .catch(() => console.log('vueStrickland: onSubmit: async validation errored/aborted.'));
      } else {
        this.vueStricklandOnSubmitValidated(event);
      }
    },
    vueStricklandOnSubmitValidated (event) {
      // Call user-defined methods to act
      this.validation.isValid ? this.onSubmission(event) : this.onSubmissionRejection(event);
    },
    logValidation (msg) {
      if (Array.isArray(this.validationHistory)) {
        this.validationHistory.push(msg);
      }
    }
  }
};

export default (formDefinition) => {
  // TODO: Add checks on formDefinition structure

  if (formDefinition.useVuex && !formDefinition.name) {
    throw new Error('Form definitions need a name when using Vuex');
  }

  let formState = formStateBuilder.build(formDefinition);

  let formMixin = {
    mixins: [formMixinBase]
  };

  if (formDefinition.useVuex) {
    // Vuex state container (via computed properties)
    formMixin.computed = {
      ...mapFormStateToStore(formState.form, formDefinition.name),
      ...mapFormFieldValidationStates(formState.form)
    };
  } else {
    // Local component state container
    formMixin.data = () => (formState);
    formMixin.computed = {
      ...mapFormFieldValidationStates(formState.form)
    };
  }

  return formMixin;
};
