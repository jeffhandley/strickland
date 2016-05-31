import { default as ValidationResult } from './ValidationResult';
import * as validation from './validation';
import * as validators from './validators';

export default { ...validators, ValidationResult, validation, validators };
export { ValidationResult, validation, validators };
export * from './validators';
