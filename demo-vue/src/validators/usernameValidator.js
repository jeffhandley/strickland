export default function usernameValidator (validatorProps) {
  return function isUsernameAvailable (username, context) {
    let resolvedSyncProps = validatorProps;

    if (typeof resolvedSyncProps === 'function') {
      resolvedSyncProps = resolvedSyncProps({...context, isComplete: false});
    }

    return {
      isValid: false,
      ...resolvedSyncProps,
      validateAsync: () => new Promise((resolve) => {
        setTimeout(() => {
          const isValid = (username !== 'marty');

          let resolvedAsyncProps = validatorProps;

          if (typeof resolvedAsyncProps === 'function') {
            resolvedAsyncProps = resolvedAsyncProps({...context, isValid, isComplete: true});
          }

          resolve({
            isValid,
            ...resolvedAsyncProps
          });
        }, 2000);
      })
    };
  };
}
