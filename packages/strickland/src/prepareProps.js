export default function prepareProps(propNames = [], params = [], value, context) {
    let props = {};
    let validationContext = {
        ...context,
        value
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
            props[propName] = paramValue;
        }

        if (propName) {
            props = {
                ...props,
                [propName]: props[propName]
            };

            validationContext = {
                ...validationContext,
                [propName]: props[propName]
            };
        }
    });

    return {
        ...props,
        value
    };
}
