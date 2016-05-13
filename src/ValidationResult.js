import { isObject } from 'lodash';

class ValidationResult {
    constructor(isValid, message, props) {
        if (isObject(message)) {
            props = message;
            message = props.message;
        } else if (isObject(isValid)) {
            props = isValid;
            isValid = props.isValid;
            message = props.message;
        }

        Object.assign(this, props);

        this.isValid = !!isValid;
        this.message = message;
    }
}

export default ValidationResult;
