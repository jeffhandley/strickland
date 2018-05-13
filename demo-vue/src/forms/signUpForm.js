import { min, minLength, required, compare, every } from 'strickland';
import isUsernameAvailable from '../validators/isUsernameAvailable';

// Define everything about your form in one place

// Define your form field state model
const fieldStateFactory = () => ({
  firstName: null,
  lastName: null,
  age: null,
  gender: null,
  username: null,
  password: null,
  confirmPassword: null,
  acceptsTerms: false
});

// Define your validation rules
const validationRulesDefinitionFactory = () => ({
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
    isUsernameAvailable,
    (username) => ({
      isValid: true,
      successMessage: `"${username}" is available`
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
});

// Define your validation dependencies
const validationDependenciesDefinitionFactory = () => ({
  password: ['confirmPassword']
});

// Export as standard object of this shape
const signUpForm = {
  name: 'signUpForm',
  useVuex: false,
  fieldStateFactory,
  validationRulesDefinitionFactory,
  validationDependenciesDefinitionFactory
};

export default signUpForm;
