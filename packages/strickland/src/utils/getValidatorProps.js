export default function getValidatorProps(propNames, params, value, context, defaultProps) {
    let props = {
        ...defaultProps,
        value
    };

    let validationContext = {
        ...props,
        ...context
    };

    params.forEach((paramValue, paramIndex) => {
        let propName = propNames[paramIndex];

        if (typeof paramValue === 'function') {
            paramValue = paramValue(validationContext);
        }

        if (typeof paramValue === 'object') {
            props = {
                ...props,
                ...paramValue
            };
        } else if (propName) {
            props = {
                ...props,
                [propName]: paramValue
            };
        }

        if (propName) {
            validationContext = {
                ...validationContext,
                [propName]: props[propName]
            };
        }
    });

    return {
        ...props
    };
}
