import React, { Component } from 'react';
import classnames from 'classnames';
import logo from './logo.svg';
import './App.css';
import validate, {every, required, minLength, compare} from 'strickland';

function getValidationClassName(form, validation, fieldName) {
    return classnames({
        'validation-value': !!form[fieldName],
        'validation-valid': validation && validation.props && validation.props[fieldName] && validation.props[fieldName].isValid,
        'validation-invalid': validation && validation.props && validation.props[fieldName] && !validation.props[fieldName].isValid
    });
}

function getValidationMessage(validation, fieldName) {
    if (validation && validation.props && validation.props[fieldName]) {
        if (!validation.props[fieldName].isValid && validation.props[fieldName].message) {
            return validation.props[fieldName].message;
        }
    }

    return null;
}

function hasValidationResults(validation, fieldName) {
    if (validation && validation.props) {
        if (fieldName) {
            return !!validation.props[fieldName];
        }

        // When the form has been validated entirely
        // we gain a value prop on the validation results
        return !!validation.value;
    }

    return false;
}

function validateField(validation, rules, fieldName, value, validationProps) {
    const result = validate(rules[fieldName], value, validationProps);
    return updateFieldResult(validation, fieldName, result);
}

function updateFieldResult(validation, fieldName, result) {
    return {
        ...validation,
        props: {
            ...((validation && validation.props) || {}),
            [fieldName]: result
        }
    };
}

function usernameIsAvailable(username) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const isValid = (username !== 'marty')
            resolve({
                isValid,
                message: isValid ? `"${username}" is available` : `Sorry, "${username}" is not available`,
                showValidation: true
            });
        }, 500);
    });
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

        this.rules = {
            firstName: required({message: 'Required'}),
            lastName: [required({message: 'Required'}), minLength(2, {message: 'Must have at least 2 characters'})],
            username: [required({message: 'Required'}), minLength(4, {message: 'Must have at least 4 characters'}), usernameIsAvailable],
            password: every([required(), minLength(8)], {message: 'Must have at least 8 characters'}),
            confirmPassword: every([required(), compare(() => this.state.form.password)], {message: 'Must match password'})
        };
    }

    onFieldChange(fieldName, fieldContext, {target}) {
        let {form, validation} = this.state;
        const {value} = target;

        form = {
            ...this.state.form,
            [fieldName]: value
        };

        let parsedValue = value;
        fieldContext = {...fieldContext};

        if (fieldContext.trim) {
            parsedValue = value.trim();
        }

        if (hasValidationResults(validation, fieldName)) {
            const result = validate(this.rules[fieldName], parsedValue);

            if (result.isValid || !validation.props[fieldName].isValid) {
                validation = updateFieldResult(validation, fieldName, result);
            }
        }

        if (fieldContext.dependents && Array.isArray(fieldContext.dependents)) {
            fieldContext.dependents.forEach((dependent) => {
                if (hasValidationResults(validation, dependent)) {
                    validation = validateField(validation, this.rules, dependent, form[dependent], {compare: parsedValue});
                }
            });
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

        Promise.resolve(validate(this.rules[fieldName], parsedValue)).then((result) => {
            // If the field is valid, show validation results on blur
            // Or, update existing validation results on blur
            // But don't show initially invalid results on a field on blur
            if (result.isValid || hasValidationResults(validation, fieldName) || result.showValidation) {
                // If the entire form has already been validated, then
                // we'll revalidate the entire form on each field blur
                if (hasValidationResults(validation)) {
                    validation = validate(this.rules, form)
                } else {
                    // Otherwise just update for the current field
                    validation = updateFieldResult(validation, fieldName, result);
                }

            }

            this.setState({validation});
        });
    }

    onSubmit() {
        Promise.resolve(validate(this.rules, this.state.form)).then((validation) => {
            this.setState({validation});
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img alt="logo" className="App-logo" src={logo} />
                    <h1 className="App-title">Strickland</h1>
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
                <pre style={{textAlign: 'left', backgroundColor: 'goldenrod', padding: 24}}>
                    {JSON.stringify(this.state, null, 2)}
                </pre>
            </div>
        );
    }
}

export default App;
