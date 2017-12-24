import validate from './validate';

export default function props(validators, validatorProps) {
    return function validateProps(value, validationProps) {
        validationProps = {
            ...validatorProps,
            ...validationProps
        };

        let result = {
            props: {}
        };

        if (value && validators && typeof validators === 'object') {
            Object.keys(validators).forEach((propName) => {
                const validatorResult = validate(validators[propName], value[propName], validationProps);

                result.props = {
                    ...result.props,
                    [propName]: validatorResult
                };
            });
        }

        return prepareResult(value, validationProps, result);
    }
}

function prepareResult(value, validationProps, result) {
    return {
        ...validationProps,
        ...result,
        isValid: Object.keys(result.props).every((propName) => !!(result.props[propName].isValid))
    };
}
