import validate, {isValid} from './strickland';

export default function props(propRules, validatorProps) {
    return function validateProps(value, validationProps) {
        if (typeof value === 'object' && value) {
            const mergedProps = {
                ...validatorProps,
                ...validationProps
            };

            const propNames = Object.keys(propRules);

            let results = {};
            let allValid = true;

            propNames.forEach((propName) => {
                const propResult = validate(propRules[propName], value[propName], mergedProps);
                allValid = allValid && isValid(propResult);

                results = {
                    ...results,
                    [propName]: propResult
                }
            });

            return {
                results,
                value,
                isValid: allValid
            };
        }

        return true;
    }
}
