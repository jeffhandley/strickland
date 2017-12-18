import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import validate, {isValid} from 'strickland';
import required from 'strickland/lib/required';
import minLength from 'strickland/lib/minLength';

const rules = {
    firstName: required({message: 'Required'}),
    lastName: [required({message: 'Required'}), minLength(2, {message: 'Must have at least 2 characters'})]
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onFieldChange(fieldName, {target}) {
        const {value} = target;

        if (this.state.validation && this.state.validation[fieldName]) {
            const validation = validate(rules[fieldName], value);

            this.setState({
                [fieldName]: value,
                validation: {
                    ...this.state.validation,
                    [fieldName]: isValid(validation) ? validation : this.state.validation[fieldName]
                }
            });
        } else {
            this.setState({[fieldName]: value});
        }
    }

    onFieldBlur(fieldName, {target}) {
        const {value} = target;

        const validation = validate(rules[fieldName], value);

        if ((this.state.validation && this.state.validation[fieldName]) || isValid(validation)) {
            this.setState({
                [fieldName]: value,
                validation: {
                    ...this.state.validation,
                    [fieldName]: validation
                }
            });
        }
    }

    onSubmit() {
        console.log('validate', validate);

        const validation = {
            firstName: validate(rules.firstName, this.state.firstName),
            lastName: validate(rules.lastName, this.state.lastName)
        };

        this.setState({validation});
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Strickland</h1>
                </header>
                <p className="App-intro">
                    <div className='formfield'>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={this.state.firstName}
                            onChange={this.onFieldChange.bind(this, 'firstName')}
                            onBlur={this.onFieldBlur.bind(this, 'firstName')}
                            className={(this.state.firstName && 'validation-value ') + (this.state.validation && this.state.validation.firstName && (this.state.validation.firstName.isValid ? 'validation-valid' : 'validation-invalid') || '')}
                        />
                        <label for="firstName" data-validation-message={(this.state.validation && this.state.validation.firstName && !this.state.validation.firstName.isValid && this.state.validation.firstName.message) || null}>First name</label>
                    </div>
                    <div class="formfield">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={this.state.lastName}
                            onChange={this.onFieldChange.bind(this, 'lastName')}
                            onBlur={this.onFieldBlur.bind(this, 'lastName')}
                            className={(this.state.lastName && 'validation-value ') + (this.state.validation && this.state.validation.lastName && (this.state.validation.lastName.isValid ? 'validation-valid' : 'validation-invalid') || '')}
                        />
                        <label for="lastName" data-validation-message={(this.state.validation && this.state.validation.lastName && !this.state.validation.lastName.isValid && this.state.validation.lastName.message) || null}>Last name</label>
                    </div>
                </p>
                <button onClick={this.onSubmit}>Submit</button>
                <pre style={{textAlign: 'left', backgroundColor: 'goldenrod', padding: 24}}>
                    {JSON.stringify(this.state, null, 2)}
                </pre>
            </div>
        );
    }
}

export default App;
