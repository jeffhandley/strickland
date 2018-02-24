let notDefined;

export default function required() {
    return function validateRequired(value) {
        let isValid = true;

        if (value === null || value === notDefined) {
            isValid = false;

        } else if (typeof value === 'string') {
            isValid = !!value.length;

        } else if (typeof value === 'boolean') {
            isValid = value;
        }

        return {
            required: true,
            isValid
        };
    }
}
