import React, { Component } from 'react';
import formValidator from './formValidator';
import { getValidationMessage, getValidationClassName } from './helpers';
import validate from 'strickland';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                firstName: '',
                lastName: '',
                username: '',
                password: '',
                confirmPassword: ''
            },
            validation: formValidator.emptyResults()
        };

        this.onSubmit = this.onSubmit.bind(this);

        const trim = true;

        this.onFieldChange = {
            firstName: this.onFieldChange.bind(this, 'firstName', {trim}),
            lastName: this.onFieldChange.bind(this, 'lastName', {trim}),
            username: this.onFieldChange.bind(this, 'username', {trim}),
            password: this.onFieldChange.bind(this, 'password', {
                dependents: ['confirmPassword']
            }),
            confirmPassword: this.onFieldChange.bind(this, 'confirmPassword', null)
        };

        this.onFieldBlur = {
            firstName: this.onFieldBlur.bind(this, 'firstName', {trim}),
            lastName: this.onFieldBlur.bind(this, 'lastName', {trim}),
            username: this.onFieldBlur.bind(this, 'username', {trim}),
            password: this.onFieldBlur.bind(this, 'password', null),
            confirmPassword: this.onFieldBlur.bind(this, 'confirmPassword', null)
        };
    }

    handleAsyncFieldValidation(fieldName, asyncFieldResult) {
        let {validation} = this.state;

        this.setState({
            validation: formValidator.updateFieldResults(validation, {[fieldName]: asyncFieldResult})
        });
    }

    onFieldChange(fieldName, fieldContext, {target}) {
        fieldContext = {...fieldContext};
        let {validation} = this.state;
        const {value} = target;

        // Get the updated form values to persist into state
        const formValues = {
            ...this.state.form,
            [fieldName]: value
        };

        // Trim the field value if needed
        const parsedValue = fieldContext.trim ? value.trim().replace(/\s+/g, ' ') : value;

        // Capture the parsed form for validation
        // But we won't persist this copy of the form
        // because we don't want to apply field parsing
        // while typing; that will happen onblur
        const parsedForm = {
            ...this.state.form,
            [fieldName]: parsedValue
        };

        // Determine which dependent fields have already been validated
        // and therefore need to be revalidated
        const dependents = fieldContext.dependents ?
            Object.keys(validation.form.validationResults).filter(
                (field) => fieldContext.dependents.includes(field)
            ) : [];

        // Validate the form specifying the current field
        // as well as dependent fields that need re-validated
        const result = formValidator.validateFields(
            parsedForm,
            [fieldName, ...dependents],
            validation
        );

        // Pluck out the result for the current field
        const fieldResult = result.form.validationResults[fieldName];

        const hasExistingResult = validation.form.validationResults[fieldName];
        const existingResult = validation.form.validationResults[fieldName] || {};

        const hasAsync = fieldResult.validateAsync || existingResult.validateAsync;
        const valueChanged = (hasExistingResult && parsedValue !== existingResult.value);

        if (hasAsync || valueChanged) {
            validation = formValidator.updateFieldResults(validation, {[fieldName]: null});
        }

        // So long as there's no async validation, then if the new
        // result is valid or the previous result was already invalid, set the result
        if (!hasAsync && (fieldResult.isValid || (hasExistingResult && !existingResult.isValid))) {
            validation = result;
        }

        this.setState({form: formValues, validation});

        setTimeout(() => {
            let {form: formAfterTimeout, validation: validationAfterTimeout} = this.state;

            // If after our idle timeout, the field hasn't yet changed and the field
            // still hasn't been validated
            if (fieldResult.value === formAfterTimeout[fieldName] && !validationAfterTimeout.form.validationResults[fieldName]) {
                // Update the field's validation state to indicate that
                // async validation is underway
                this.setState({
                    validation: formValidator.updateFieldResults(
                        validationAfterTimeout, {[fieldName]: fieldResult}
                    )
                });

                // Fire off async validation
                if (fieldResult.validateAsync) {
                    fieldResult.validateAsync(() => this.state.form[fieldName])
                        .then(this.handleAsyncFieldValidation.bind(this, fieldName))
                        .catch(() => {});
                }
            }
        }, 1000);
    }

    onFieldBlur(fieldName, fieldContext, {target}) {
        fieldContext = {...fieldContext};
        const {value} = target;

        // Trim the field value if needed
        const parsedValue = fieldContext.trim ? value.trim().replace(/\s+/g, ' ') : value;

        let formValues = this.state.form;

        // If trimming changed the value, update the form state
        if (parsedValue !== value) {
            formValues = {
                ...this.state.form,
                [fieldName]: parsedValue
            };

            this.setState({form: formValues});
        }

        let {validation} = this.state;

        // Validate if the field has not been validated yet or the value has changed
        if (!validation.form.validationResults[fieldName] || validation.form.validationResults[fieldName].value !== parsedValue) {
            // Determine which dependent fields have already been validated
            // and therefore need to be revalidated
            const dependents = fieldContext.dependents ?
                Object.keys(validation.form.validationResults).filter(
                    (field) => fieldContext.dependents.includes(field)
                ) : [];

            // Validate the form specifying the current field
            // as well as dependent fields that need re-validated
            validation = formValidator.validateFields(
                formValues,
                [fieldName, ...dependents],
                validation
            );

            this.setState({validation});
        }

        // Pluck out the result for the current field
        const fieldResult = validation.form.validationResults[fieldName];

        // If the field needs async validation, fire it off
        if (fieldResult.validateAsync) {
            fieldResult.validateAsync(() => this.state.form[fieldName])
                .then(this.handleAsyncFieldValidation.bind(this, fieldName))
                .catch(() => {});
        }
    }

    onSubmit() {
        const validation = validate(formValidator, this.state.form);
        this.setState({validation});

        if (validation.validateAsync) {
            validation.validateAsync(() => this.state.form)
                .then((asyncValidation) => this.setState({validation: asyncValidation}))
                .catch(() => {});
        }
    }

    render() {
        return (
            <div>
                <div className="form">
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.state.form, this.state.validation, 'firstName')}
                            id="firstName"
                            name="firstName"
                            onBlur={this.onFieldBlur.firstName}
                            onChange={this.onFieldChange.firstName}
                            type="text"
                            value={this.state.form.firstName}
                        />
                        <label data-validation-message={getValidationMessage(this.state.validation, 'firstName')} htmlFor="firstName">First name</label>
                    </div>
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.state.form, this.state.validation, 'lastName')}
                            id="lastName"
                            name="lastName"
                            onBlur={this.onFieldBlur.lastName}
                            onChange={this.onFieldChange.lastName}
                            type="text"
                            value={this.state.form.lastName}
                        />
                        <label data-validation-message={getValidationMessage(this.state.validation, 'lastName')} htmlFor="lastName">Last name</label>
                    </div>
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.state.form, this.state.validation, 'username')}
                            id="username"
                            name="username"
                            onBlur={this.onFieldBlur.username}
                            onChange={this.onFieldChange.username}
                            type="text"
                            value={this.state.form.username}
                        />
                        <label data-validation-message={getValidationMessage(this.state.validation, 'username')} htmlFor="username">Username</label>
                    </div>
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.state.form, this.state.validation, 'password')}
                            id="password"
                            name="password"
                            onBlur={this.onFieldBlur.password}
                            onChange={this.onFieldChange.password}
                            type="password"
                            value={this.state.form.password}
                        />
                        <label data-validation-message={getValidationMessage(this.state.validation, 'password')} htmlFor="password">Password</label>
                    </div>
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.state.form, this.state.validation, 'confirmPassword')}
                            id="confirmPassword"
                            name="confirmPassword"
                            onBlur={this.onFieldBlur.confirmPassword}
                            onChange={this.onFieldChange.confirmPassword}
                            type="password"
                            value={this.state.form.confirmPassword}
                        />
                        <label data-validation-message={getValidationMessage(this.state.validation, 'confirmPassword')} htmlFor="confirmPassword">Confirm password</label>
                    </div>
                    <div className="formactions">
                        <div>
                            <button onClick={this.onSubmit}>Submit</button>
                        </div>
                        <div>
                            {(this.state.validation && this.state.validation.isValid) ? 'Can Submit' : 'Cannot Submit Yet'}
                        </div>
                    </div>
                </div>
                <pre id="current-state">
                    {JSON.stringify(this.state.validation, null, 2)}
                </pre>
            </div>
        );
    }
}

export default App;
