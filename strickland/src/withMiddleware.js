import validate from './validate';

export default (validator, middleware) => (value, validationContext) =>
    validate(validator, value, {
        ...validationContext,
        middleware: validationContext && validationContext.middleware ? [
            ...(Array.isArray(middleware) ? middleware : [middleware]),
            ...(Array.isArray(validationContext.middleware) ?
                    validationContext.middleware :
                    [validationContext.middleware]
                )
        ] : middleware
    });
