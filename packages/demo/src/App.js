import React, { Component } from 'react';
import classnames from 'classnames';
import logo from './logo.svg';
import './App.css';
import validate, {isValid} from 'strickland';
import required from 'strickland/lib/required';
import minLength from 'strickland/lib/minLength';
import compare from 'strickland/lib/compare';

function getValidationClassName(form, validation, fieldName) {
    return classnames({
        'validation-value': !!form[fieldName],
        'validation-valid': validation && validation[fieldName] && validation[fieldName].isValid,
        'validation-invalid': validation && validation[fieldName] && !validation[fieldName].isValid
    });
}

function getValidationMessage(validation, fieldName) {
    if (validation && validation[fieldName]) {
        if (!validation[fieldName].isValid && validation[fieldName].message) {
            return validation[fieldName].message;
        }
    }

    return null;
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
            lastName: [required({message: 'Required'}), minLength(2, {message: 'Must have at least 2 characters'})],
            password: [required({message: 'Required'}), minLength(8, {message: 'Must have at least 8 characters'})],
            confirmPassword: [required(), compare(() => this.state.form.password, {message: 'Must match password'})]
        };
    }

    onFieldChange(fieldName, {target}) {
        const {value} = target;

        if (this.state.validation && this.state.validation[fieldName]) {
            const validation = validate(this.rules[fieldName], value);

            this.setState({
                form: {
                    ...this.state.form,
                    [fieldName]: value
                },
                validation: {
                    ...this.state.validation,
                    [fieldName]: isValid(validation) ? validation : this.state.validation[fieldName]
                }
            });
        } else {
            this.setState({
                form: {
                    ...this.state.form,
                    [fieldName]: value
                }
            });
        }
    }

    onFieldBlur(fieldName, {target}) {
        const {value} = target;

        const validation = validate(this.rules[fieldName], value);

        if ((this.state.validation && this.state.validation[fieldName]) || isValid(validation)) {
            this.setState({
                form: {
                    ...this.state.form,
                    [fieldName]: value
                },
                validation: {
                    ...this.state.validation,
                    [fieldName]: validation
                }
            });
        }
    }

    onSubmit() {
        const validation = validate(this.rules, this.state.form);
        this.setState({validation: validation.results});
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Strickland</h1>
                </header>
                <div className='formfield'>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={this.state.form.firstName}
                        onChange={this.onFieldChange.firstName}
                        onBlur={this.onFieldBlur.firstName}
                        className={getValidationClassName(this.state.form, this.state.validation, 'firstName')}
                    />
                    <label htmlFor="firstName" data-validation-message={getValidationMessage(this.state.validation, 'firstName')}>First name</label>
                </div>
                <div className="formfield">
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={this.state.form.lastName}
                        onChange={this.onFieldChange.lastName}
                        onBlur={this.onFieldBlur.lastName}
                        className={getValidationClassName(this.state.form, this.state.validation, 'lastName')}
                    />
                    <label htmlFor="lastName" data-validation-message={getValidationMessage(this.state.validation, 'lastName')}>Last name</label>
                </div>
                <div className="formfield">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={this.state.form.password}
                        onChange={this.onFieldChange.password}
                        onBlur={this.onFieldBlur.password}
                        className={getValidationClassName(this.state.form, this.state.validation, 'password')}
                    />
                    <label htmlFor="password" data-validation-message={getValidationMessage(this.state.validation, 'password')}>Password</label>
                </div>
                <div className="formfield">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={this.state.form.confirmPassword}
                        onChange={this.onFieldChange.confirmPassword}
                        onBlur={this.onFieldBlur.confirmPassword}
                        className={getValidationClassName(this.state.form, this.state.validation, 'confirmPassword')}
                    />
                    <label htmlFor="confirmPassword" data-validation-message={getValidationMessage(this.state.validation, 'confirmPassword')}>Confirm password</label>
                </div>
                <button onClick={this.onSubmit}>Submit</button>
                <pre style={{textAlign: 'left', backgroundColor: 'goldenrod', padding: 24}}>
                    {JSON.stringify(this.state, null, 2)}
                </pre>
            </div>
        );
    }
}

export default App;
