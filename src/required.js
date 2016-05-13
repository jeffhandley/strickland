import ValidationResult from './ValidationResult';

export const message = 'Required';

export default function(value, resultMessage = message, props) {
    const isValid = !!value;
    return new ValidationResult(isValid, resultMessage, props);
}
