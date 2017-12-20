import validate, {isValid} from './strickland';

export default function props(propRules, validatorProps) {
    return function validateProps(value, validationProps) {
        const mergedProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {
            ...mergedProps,
            value,
            isValid: true
        };

        if (typeof value === 'object' && value) {
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

            result = {
                ...result,
                results,
                isValid: allValid
            };
        }

        return result;
    }
}
