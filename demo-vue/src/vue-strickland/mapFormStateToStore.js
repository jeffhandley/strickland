import { mapState } from 'vuex';

function mapFormFields (formName, fieldNames, that) {
  let form = {};
  fieldNames.forEach((fieldName) => {
    Object.defineProperty(form, fieldName, {
      get: function () {
        return that.$store.state[formName].form[fieldName];
      },
      set: function (value) {
        that.$store.commit('vueStricklandSetFormFieldValue', { formName, fieldName, value });
      }
    });
  });
  return form;
}

export default function mapFormStateToStore (form, formName) {
  // Add getters/setters for form fields
  let fieldNames = Object.keys(form);

  return {
    form () {
      return mapFormFields(formName, fieldNames, this);
    },
    ...mapState({
      validationDependencies: state => state[formName].validationDependencies,
      validator: state => state[formName].validator
    }),
    validation: {
      get () {
        return this.$store.state[formName].validation;
      },
      set (value) {
        this.$store.commit('vueStricklandSetValidation', { formName, value });
      }
    }
  };
}
