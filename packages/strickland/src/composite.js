export default function composite(validators, validatorProps) {
    return validators.map((validator) => validator(validatorProps));
}
