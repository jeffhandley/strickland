export default function isUsernameAvailable(username) {
    return {
        isValid: false,
        message: `Checking availability of "${username}"...`,
        validateAsync: () => new Promise((resolve) => {
            setTimeout(() => {
                const isValid = (username !== 'marty');
                resolve({
                    isValid,
                    message: isValid ? `"${username}" is available` : `Sorry, "${username}" is not available`
                });
            }, 2000);
        })
    };
}
