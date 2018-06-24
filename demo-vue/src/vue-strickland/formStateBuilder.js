import { form } from 'strickland';

const formStateBuilder = {
  build (formDefinition) {
    let validator = form(formDefinition.validationRulesDefinitionFactory());

    return {
      form: formDefinition.fieldStateFactory(),
      validationDependencies: formDefinition.validationDependenciesDefinitionFactory(),
      validator,
      validation: validator.emptyResults()
    };
  }
};

export default formStateBuilder;
