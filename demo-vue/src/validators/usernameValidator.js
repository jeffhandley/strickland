export default function usernameValidator (validatorProps) {
  return function isUsernameAvailable (username, context) {
    let resolvedProps = validatorProps;

    if (typeof resolvedProps === 'function') {
      resolvedProps = resolvedProps({...context, isComplete: false});
    }

    return {
      isValid: false,
      ...resolvedProps,
      message: resolvedProps.pendingMessage,
      validateAsync: () => new Promise((resolve) => {
        setTimeout(() => {
          const {validMessage, invalidMessage} = resolvedProps;
          const isValid = (username !== 'marty');

          resolve({
            isValid,
            ...resolvedProps,
            message: isValid ? validMessage : invalidMessage
          });
        }, 2000);
      })
    };
  };
}
