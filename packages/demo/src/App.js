import React, { Component } from 'react';
import classnames from 'classnames';
import logo from './logo.svg';
import './App.css';
import validate, {isValid, required, minLength, compare} from 'strickland';

function getValidationClassName(form, validation, fieldName) {
    return classnames({
        'validation-value': !!form[fieldName],
        'validation-valid': validation && validation.results && validation.results[fieldName] && validation.results[fieldName].isValid,
        'validation-invalid': validation && validation.results && validation.results[fieldName] && !validation.results[fieldName].isValid
    });
}

function getValidationMessage(validation, fieldName) {
    if (validation && validation.results && validation.results[fieldName]) {
        if (!validation.results[fieldName].isValid && validation.results[fieldName].message) {
            return validation.results[fieldName].message;
        }
    }

    return null;
}

function hasValidationResults(validation, fieldName) {
    if (validation && validation.results) {
        if (fieldName) {
            return !!validation.results[fieldName];
        }

        return true;
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
                password: '',
                confirmPassword: ''
            }
        };

        this.onSubmit = this.onSubmit.bind(this);

        this.onFieldChange = {
            firstName: this.onFieldChange.bind(this, 'firstName'),
            lastName: this.onFieldChange.bind(this, 'lastName'),
            password: this.onFieldChange.bind(this, 'password'),
            confirmPassword: this.onFieldChange.bind(this, 'confirmPassword')
        };

        this.onFieldBlur = {
            firstName: this.onFieldBlur.bind(this, 'firstName'),
            lastName: this.onFieldBlur.bind(this, 'lastName'),
            password: this.onFieldBlur.bind(this, 'password'),
            confirmPassword: this.onFieldBlur.bind(this, 'confirmPassword')
        };

        this.rules = {
            firstName: required({message: 'Required'}),
            lastName: [
                required({message: 'Required'}),
                minLength(2, {message: 'Must have at least 2 characters'})
            ],
            password: [
                required({message: 'Required', trim: false}),
                minLength(8, {message: 'Must have at least 8 characters', trim: false})
            ],
            confirmPassword: [
                required({message: 'Required', trim: false}),
                compare(() => this.state.form.password, {message: 'Must match password', trim: false})
            ]
        };
    }

    onFieldChange(fieldName, {target}) {
        const {value} = target;

        let form = {
            ...this.state.form,
            [fieldName]: value
        };

        if (hasValidationResults(this.state.validation)) {
            let validation = {
                ...this.state.validation,
                results: {
                    ...(this.state.validation ? this.state.validation.results : {})
                }
            };

            if (validation.results[fieldName]) {
                validation.results[fieldName] = validate(this.rules[fieldName], value);
            }

            if (fieldName === 'password' && validation.results.confirmPassword) {
                const validateProps = {compare: value};
                validation.results.confirmPassword = validate(this.rules.confirmPassword, this.state.form.confirmPassword, validateProps);
            }

            this.setState({form, validation});
        } else {
            this.setState({form});
        }
    }

    onFieldBlur(fieldName, {target}) {
        const {value} = target;

        const validation = validate(this.rules[fieldName], value);

        // If the field is valid, show validation results on blur
        // Or, update existing validation results on blur
        // But don't show initially invalid results on a field on blur
        if (isValid(validation) || hasValidationResults(fieldName)) {
            // Once the field is valid or we're rendering validation results
            // then update the field on blur to reflect the parsed value
            this.setState({
                form: {
                    ...this.state.form,
                    [fieldName]: validation.parsedValue
                },
                validation: {
                    ...this.state.validation,
                    results: {
                        ...(this.state.validation ? this.state.validation.results : {}),
                        [fieldName]: validation
                    }
                }
            });
        }
    }

    onSubmit() {
        const validation = validate(this.rules, this.state.form);
        this.setState({validation: validation});
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
