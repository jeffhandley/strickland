export default class ValidationResult {
    constructor(isValid, props) {
        Object.assign(this, props);
        this.isValid = !!isValid;
    }
}
