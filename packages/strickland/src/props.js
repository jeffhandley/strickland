import validate, {isValid} from './strickland';

export default function props(propRules, validatorProps) {
    return function validateProps(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {
            ...validationProps,
            value,
            isValid: true
        };

        if (typeof value === 'object' && value) {
            const propNames = Object.keys(propRules);

            let propResults = {};
            let allValid = true;

            propNames.forEach((propName) => {
                const propResult = validate(propRules[propName], value[propName], validationProps);
                allValid = allValid && isValid(propResult);

                propResults = {
                    ...propResults,
                    [propName]: propResult
                }
            });

            result = {
                ...result,
                props: propResults,
                isValid: allValid
            };
        }

        return result;
    }
}
