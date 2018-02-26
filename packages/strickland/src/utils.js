export function isFalsyButNotZero(value) {
    if (value === 0) {
        return false;
    }

    return !value;
}

export function prepareProps(defaultProps, propNames = [], params = [], context) {
    let props = {
        ...defaultProps
    };

    let validationContext = {
        ...defaultProps,
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
