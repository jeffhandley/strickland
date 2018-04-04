import validate from 'strickland';

const TAGNAME_SELECT = 'SELECT';
const TAGNAME_INPUT = 'INPUT';
const ATTRIBUTE_TYPE_CHECKBOX = 'checkbox';
const ATTRIBUTE_TYPE_RADIO = 'radio';
const ATTRIBUTE_MULTIPLE = 'multiple';

const isSelectInput = (element) => element.tagName === TAGNAME_SELECT;
const isCheckboxInput = (element) => element.tagName === TAGNAME_INPUT && element.type === ATTRIBUTE_TYPE_CHECKBOX;
const isRadioInput = (element) => element.tagName === TAGNAME_INPUT && element.type === ATTRIBUTE_TYPE_RADIO;
const shouldUseChangeEvent = (element) => isSelectInput(element) || isCheckboxInput(element) || isRadioInput(element);
const shouldUseChangeEventOnDelay = (element) => isSelectInput(element) && element.attributes[ATTRIBUTE_MULTIPLE];

export default (validator) => ({
  data: () => ({
    validator,
    validation: validator.emptyResults()
  }),
  computed: {
    isValid: () => this.validation && this.validation.isValid
  },
  methods: {
    validateAsync (fieldResult, fieldName) {
      this.logValidation(`strickland:validateAsync method triggered for field: '${fieldName}'.`);
      fieldResult.validateAsync(() => this.form[fieldName])
        .then((result) => {
          // TODO: Do we need to check for change/race condition as per:
          // https://strickland.io/docs/Async/RaceConditions.html
          this.validation = this.validator.updateFieldResults(this.validation, { [fieldName]: result });
        })
        .catch((result) => {
          console.error(`Error on async validation for field: ${fieldName}.`, result);
        });
    },
    getDependentsNeedingRevalidation (fieldName, validationResults) {
      let dependents = this.validationDependencies ? this.validationDependencies[fieldName] : null;
      return dependents
        ? Object.keys(validationResults).filter((field) => dependents.includes(field))
        : [];
    },
    stricklandOnChange (event, sender) {
      console.log('strickland:onChange has been called', event, sender);
      if (shouldUseChangeEvent(event.target)) {
        console.log('strickland:onChange, handling');
        shouldUseChangeEventOnDelay(event.target)
          ? this.handleChangeAfterDelay(event) // TODO: Test out with <select multiple>...</select>
          : this.handleChangeImmediately(event);
      }
    },
    stricklandOnInput (event) {
      if (!shouldUseChangeEvent(event)) {
        console.log('strickland:onInput, rejecting');
        return;
      }

      this.handleChangeAfterDelay(event);
    },
    stricklandOnFocusOut (event) {
      if (shouldUseChangeEvent(event.target)) {
        console.log('strickland:onFocusOut, rejecting');
        return;
      }

      this.handleChangeImmediately(event);
    },
    handleChangeAfterDelay (event) {
      let fieldName = event.target.name;
      let value = this.form[fieldName];
      this.logValidation(`strickland:onInput method triggered by field: '${fieldName}' with value: '${value}'.`);

      // Determine which dependent fields have already been validated
      // and therefore need to be revalidated
      const dependentsNeedingRevalidation = this.getDependentsNeedingRevalidation(
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
      const hasChanged = oldFieldResult && value !== oldFieldResult.value;

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
            this.validateAsync(newFieldResult, fieldName);
          }
        }
      }, 1000); // TODO: Make this configurable via data.validationTimeoutInSeconds or similar
    },
    handleChangeImmediately (event) {
      let fieldName = event.target.name;
      let value = this.form[fieldName];
      this.logValidation(`strickland:onFocusOut method triggered by field: '${fieldName}', with value: '${value}'.`);

      // Validate if the field has not been validated yet or the value has changed
      if (!this.validation.form.validationResults[fieldName] || this.validation.form.validationResults[fieldName].value !== value) {
        // Determine which dependent fields have already been validated
        // and therefore need to be revalidated
        const dependentsNeedingRevalidation = this.getDependentsNeedingRevalidation(
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
        this.validateAsync(fieldResult, fieldName);
      }
    },
    stricklandOnSubmit (event) {
      this.logValidation(`strickland:onSubmit triggered called by: '${event.target}'.`);

      this.validation = validate(this.validator, this.form);

      if (this.validation.validateAsync) {
        this.validation.validateAsync(() => this.form)
          .then((result) => {
            this.validation = result;
            this.stricklandOnSubmitValidated(event);
          })
          .catch(() => console.log('Error validating async'));
      } else {
        this.stricklandOnSubmitValidated(event);
      }
    },
    stricklandOnSubmitValidated (event) {
      // Call user-defined methods to act
      this.validation.isValid ? this.onSubmission(event) : this.onSubmissionRejection(event);
    },
    logValidation (msg) {
      if (Array.isArray(this.validationHistory)) {
        this.validationHistory.push(msg);
      }
    }
  }
});
