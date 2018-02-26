import React, { Component } from 'react';
import classnames from 'classnames';
import './App.css';
import validate, {validateAsync, form, every, required, minLength, compare} from 'strickland';

function conditional(shouldValidate, validator) {
    return function validateConditional(value, validationContext) {
        if (shouldValidate(value, validationContext)) {
            return validate(validator, value, validationContext);
        }

        return true;
    }
}

function usernameIsAvailable(username) {
    console.log('usernameIsAvailable', username);

    return {
        isValid: false,
        message: `Checking availability of "${username}"...`,
        validateAsync: new Promise((resolve) => {
            setTimeout(() => {
                const isValid = (username !== 'marty')
                resolve({
                    isValid,
                    message: isValid ? `"${username}" is available` : `Sorry, "${username}" is not available`
                });
            }, 2000);
        })
    };
}

const validationRules = form({
    firstName: required({message: 'Required'}),
    lastName: [
        required({message: 'Required'}),
        minLength(2, {message: 'Must have at least 2 characters'})
    ],
    username: [
        required({message: 'Required'}),
        minLength(4, {message: 'Must have at least 4 characters'}),
        conditional(
            (value, validationContext) => !validationContext.onFieldChange,
            usernameIsAvailable
        )
    ],
    password: every(
        [required(), minLength(8)],
        {message: 'Must have at least 8 characters'}
    ),
    confirmPassword: every(
        [required(), compare(({form}) => form.values.password)],
        {message: 'Must match password'}
    )
});

function getValidationClassName(form, validation, fieldName) {
    const fieldValidation = validation && validation.form && validation.form.validationResults[fieldName];

    return classnames({
        'validation-value': !!form[fieldName],
        'validation-valid': fieldValidation && fieldValidation.isValid,
        'validation-async': fieldValidation && fieldValidation.validateAsync,
        'validation-invalid': fieldValidation && !fieldValidation.isValid && !fieldValidation.validateAsync
    });
}

function getValidationMessage(validation, fieldName) {
    const fieldValidation = validation && validation.form && validation.form.validationResults[fieldName];

    if (fieldValidation && !fieldValidation.isValid) {
        return fieldValidation.message;
    }

    return null;
}

function hasValidationResults(validation, fieldName) {
    if (validation && validation.form) {
        if (fieldName) {
            return !!validation.form.validationResults[fieldName];
        }

        return !!validation.form.isComplete;
    }

    return false;
}

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
            }
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
            username: this.onFieldBlur.bind(this, 'username', null),
            password: this.onFieldBlur.bind(this, 'password', null),
            confirmPassword: this.onFieldBlur.bind(this, 'confirmPassword', null)
        };

    }

    onFieldChange(fieldName, fieldContext, {target}) {
        let {form, validation} = this.state;
        const {value} = target;

        let parsedValue = value;

        fieldContext = {...fieldContext};

        if (fieldContext.trim) {
            parsedValue = value.trim();
        }

        form = {
            ...this.state.form,
            [fieldName]: value
        };

        const parsedForm = {
            ...this.state.form,
            [fieldName]: parsedValue
        };

        if (hasValidationResults(validation, fieldName)) {
            const result = validate(
                validationRules,
                parsedForm,
                {
                    onFieldChange: true,
                    form: {
                        validationResults: validation.form.validationResults,
                        fields: [
                            fieldName,
                            ...((fieldContext.dependents) || [])
                        ]
                    }
                }
            );

            if (result.form.validationResults[fieldName].isValid || !result.form.validationResults[fieldName].isValid) {
                validation = result;
            }
        }

        this.setState({form, validation});
    }

    onFieldBlur(fieldName, fieldContext, {target}) {
        let {form, validation} = this.state;
        const {value} = target;

        let parsedValue = value;
        fieldContext = {...fieldContext};

        if (fieldContext.trim) {
            parsedValue = value.trim();

            form = {
                ...form,
                [fieldName]: parsedValue
            };

            this.setState({form});
        }

        let result = validate(validationRules, form, {
            form: {
                validationResults: validation && validation.form && validation.form.validationResults,
                fields: [
                    fieldName,
                    ...((fieldContext.dependents) || [])
                ]
            }
        });

        console.log(result.form.validationResults[fieldName].isValid, hasValidationResults(validation, fieldName));

        // If the field is valid, show validation results on blur
        // Or, update existing validation results on blur
        // But don't show initially invalid results on a field on blur
        if (result.form.validationResults[fieldName].isValid || hasValidationResults(validation, fieldName) || result.validateAsync) {
            // If the entire form has already been validated, then
            // we'll revalidate the entire form on each field blur
            if (hasValidationResults(validation)) {
                validation = validate(validationRules, form);

                if (validation.validateAsync) {
                    validation.validateAsync.then((asyncResult) => {
                        const currentForm = this.state.form;

                        if (currentForm[fieldName] === asyncResult.value[fieldName]) {
                            this.setState({validation: asyncResult});
                        }
                    });
                }
            } else {
                validation = result;

                if (result.validateAsync) {
                    result.validateAsync.then((asyncResult) => {
                        const currentForm = this.state.form;

                        if (currentForm[fieldName] === asyncResult.value[fieldName]) {
                            this.setState({validation: asyncResult});
                        }
                    });
                }
            }
        }

        this.setState({validation});
    }

    onSubmit() {
        validateAsync(validationRules, this.state.form).then((validation) => {
            this.setState({validation});
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1><img alt="logo" aria-label="Strickland demo" className="App-logo" src="https://raw.githubusercontent.com/jeffhandley/strickland/master/logo/strickland-black.png" /></h1>
                </header>
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
