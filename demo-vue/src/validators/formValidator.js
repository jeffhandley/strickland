import { form, min, required, compare, every } from 'strickland';
import { formDefinition } from '../../../demo/src/formValidator';

const formDefinitionExtended = {
  ...formDefinition,
  age: [
    required({ message: 'Required' }),
    min({ min: 18, message: 'You must be 18+.' })
  ],
  gender: required({ message: 'Required' }),
  acceptsTerms: [
    every(
      [required(), compare(true)],
      { message: 'You must accept the terms and conditions.' }
    )
  ]
};

export default form(formDefinitionExtended);
