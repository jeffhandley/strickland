import { isObject } from 'lodash';

class ValidationResult {
    constructor(isValid, props) {
        if (isObject(isValid)) {
            props = isValid;
            isValid = props.isValid;
        }

        Object.assign(this, props);

        this.isValid = !!isValid;
    }
}

export default ValidationResult;
