import { form, min, minLength, required, compare, every } from 'strickland';
import usernameValidator from '../validators/usernameValidator';

// Define everything about your form in one place

// Define your form fields (data model)
const fieldsDefinitionFactory = () => ({
  firstName: null,
  lastName: null,
  age: null,
  gender: null,
  username: null,
  password: null,
  confirmPassword: null,
  acceptsTerms: false
});

// Define your validation requirements
const validationDefinition = {
  firstName: required({message: 'Required'}),
  lastName: [
    required({message: 'Required'}),
    minLength({minLength: 2, message: 'Must have at least 2 characters'})
  ],
  username: [
    required({message: 'Required'}),
    (value) => {
      if (value && value.trim().indexOf(' ') > -1) {
        return {
          isValid: false,
          message: 'Cannot contain spaces'
        };
      }

      return true;
    },
    minLength({minLength: 4, message: 'Must have at least 4 characters'}),
    usernameValidator(({isComplete, isValid, value}) => {
      if (isComplete && isValid) {
        return {message: `"${value} is available`, showValidMessage: true};
      } else if (isComplete) {
        return {message: `Sorry, "${value}" is not available`};
      } else {
        return {message: `Checking availability of "${value}"...`};
      }
    })
  ],
  password: every(
    [required(), minLength(8)],
    {message: 'Must have at least 8 characters'}
  ),
  confirmPassword: every(
    [required(), compare(({form: {values: {password}}}) => ({compare: password}))],
    {message: 'Must match password'}
  ),
  age: [
    required({ message: 'Required' }),
    min({ min: 18, message: 'You must be 18+.' })
  ],
  gender: required({ message: 'Required' }),
  acceptsTerms: required({ message: 'You must accept the terms and conditions.' })
};

// Define your validation dependencies
const validationDependenciesDefinition = {
  password: ['confirmPassword']
};

// Export as object with:
//  - a factory to build a new data model
//  - the Strickland validator
const signUpForm = {
  formFactory: fieldsDefinitionFactory,
  validator: form(validationDefinition),
  validationDependencies: validationDependenciesDefinition
};

export default signUpForm;
