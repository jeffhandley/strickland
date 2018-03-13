import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {connect, Provider} from 'react-redux';
import formValidator, {getValidationMessage, getValidationClassName} from './formValidator';
import validate from 'strickland';

const fieldContext = {
    firstName: {
        trim: true
    },
    lastName: {
        trim: true
    },
    username: {
        trim: true
    },
    password: {
        dependents: ['confirmPassword']
    },
    confirmPassword: {}
};

const initialState = {
    form: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: ''
    },
    parsedForm: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: ''
    },
    validation: formValidator.emptyResults()
};

function parseValue(fieldName, value) {
    return fieldContext[fieldName].trim ? value.trim().replace(/\s+/g, ' ') : value;
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'FIELD_VALUE_CHANGED':
            return {
                ...state,
                form: {
                    ...state.form,
                    [action.fieldName]: action.value
                },
                parsedForm: {
                    ...state.parsedForm,
                    [action.fieldName]: parseValue(action.fieldName, action.value)
                }
            };

        case 'FIELD_RESULT_UPDATED':
            return {
                ...state,
                validation: formValidator.updateFieldResults(
                    state.validation,
                    {
                        [action.fieldName]: action.fieldResult
                    }
                )
            };

        case 'VALIDATION_CHANGED':
            return {
                ...state,
                validation: action.validation
            };

        default:
            return state;
    }
}

function onFieldValueChanged(fieldName, value, applyParsing) {
    return {
        type: 'FIELD_VALUE_CHANGED',
        fieldName,
        value: applyParsing ? parseValue(fieldName, value) : value
    };
}

function onFieldValidateAsync(fieldName, fieldResult) {
    return (dispatch, getState) => {
        if (fieldResult.validateAsync) {
            fieldResult.validateAsync(() => getState().parsedForm[fieldName])
                .then((asyncFieldResult) => dispatch(onFieldResultUpdated(fieldName, asyncFieldResult)))
                .catch(() => {});
        }
    };
}

function onFieldResultUpdated(fieldName, fieldResult) {
    return {
        type: 'FIELD_RESULT_UPDATED',
        fieldName,
        fieldResult
    };
}

function onValidationChanged(validation) {
    return {
        type: 'VALIDATION_CHANGED',
        validation
    };
}

function validateFieldAndDependents(fieldName, validation, form) {
    // Determine which dependent fields have already been validated
    // and therefore need to be revalidated
    const dependents = fieldContext[fieldName].dependents ?
        Object.keys(validation.form.validationResults).filter(
            (field) => fieldContext[fieldName].dependents.includes(field)
        ) : [];

    // Validate the form specifying the current field
    // as well as dependent fields that need re-validated
    return formValidator.validateFields(
        form,
        [fieldName, ...dependents],
        validation
    );
}

function onFieldChanged(fieldName, value) {
    return (dispatch, getState) => {
        dispatch(onFieldValueChanged(fieldName, value));
        let {validation, parsedForm} = getState();

        const result = validateFieldAndDependents(fieldName, validation, parsedForm);

        // Pluck out the result for the current field
        const fieldResult = result.form.validationResults[fieldName];
        const existingResult = validation.form.validationResults[fieldName];

        const hasAsync = !!(fieldResult.validateAsync || (existingResult && existingResult.validateAsync));
        const valueChanged = (existingResult && parsedForm[fieldName] !== existingResult.value);

        // So long as there's no async validation, then if the new
        // result is valid or the previous result was already invalid, set the result
        if (!hasAsync && (fieldResult.isValid || (existingResult && !existingResult.isValid))) {
            dispatch(onValidationChanged(result));
        } else if (valueChanged) {
            // If we are not going to show the result, but the
            // value has changed, then we need to clear the result
            dispatch(onFieldResultUpdated(fieldName, null));
        }

        setTimeout(() => {
            let {parsedForm: formAfterTimeout, validation: validationAfterTimeout} = getState();

            // If after our idle timeout, the field hasn't yet changed and the field
            // still hasn't been validated
            if (fieldResult.value === formAfterTimeout[fieldName] && !validationAfterTimeout.form.validationResults[fieldName]) {
                // Update the field's validation state to indicate that
                // async validation is underway
                dispatch(onFieldResultUpdated(fieldName, fieldResult));
                dispatch(onFieldValidateAsync(fieldName, fieldResult));
            }
        }, 1000);
    };
}

function onFieldBlur(fieldName, value) {
    return (dispatch, getState) => {
        dispatch(onFieldValueChanged(fieldName, value, true));

        let {parsedForm, validation} = getState();

        // Validate if the field has not been validated yet or the value has changed
        if (!validation.form.validationResults[fieldName] || validation.form.validationResults[fieldName].value !== parsedForm[fieldName]) {
            validation = validateFieldAndDependents(fieldName, validation, parsedForm);
            dispatch(onValidationChanged(validation));
        }

        // Pluck out the result for the current field
        const fieldResult = validation.form.validationResults[fieldName];
        dispatch(onFieldValidateAsync(fieldName, fieldResult));
    };
}

function onFormSubmit() {
    return (dispatch, getState) => {
        const result = validate(formValidator, getState().form);
        dispatch(onValidationChanged(result));

        if (result.validateAsync) {
            result.validateAsync(() => getState().form)
                .then((validation) => dispatch(onValidationChanged(validation)))
                .catch(() => {});
        }
    };
}

const store = createStore(reducer, applyMiddleware(thunk));

class App extends Component {
    static propTypes = {
        form: PropTypes.object,
        onFieldBlur: PropTypes.func.isRequired,
        onFieldChanged: PropTypes.func.isRequired,
        onFormSubmit: PropTypes.func.isRequired,
        validation: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);

        this.onFieldChanged = {
            firstName: this.onFieldChanged.bind(this, 'firstName'),
            lastName: this.onFieldChanged.bind(this, 'lastName'),
            username: this.onFieldChanged.bind(this, 'username'),
            password: this.onFieldChanged.bind(this, 'password'),
            confirmPassword: this.onFieldChanged.bind(this, 'confirmPassword')
        };

        this.onFieldBlur = {
            firstName: this.onFieldBlur.bind(this, 'firstName'),
            lastName: this.onFieldBlur.bind(this, 'lastName'),
            username: this.onFieldBlur.bind(this, 'username'),
            password: this.onFieldBlur.bind(this, 'password'),
            confirmPassword: this.onFieldBlur.bind(this, 'confirmPassword')
        };
    }

    onFieldChanged(fieldName, {target: {value}}) {
        this.props.onFieldChanged(fieldName, value);
    }

    onFieldBlur(fieldName, {target: {value}}) {
        this.props.onFieldBlur(fieldName, value);
    }

    onSubmit() {
        this.props.onFormSubmit();
    }

    render() {
        return (
            <div>
                <div className="form">
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.props.form, this.props.validation, 'firstName')}
                            id="firstName"
                            name="firstName"
                            onBlur={this.onFieldBlur.firstName}
                            onChange={this.onFieldChanged.firstName}
                            type="text"
                            value={this.props.form.firstName}
                        />
                        <label data-validation-message={getValidationMessage(this.props.validation, 'firstName')} htmlFor="firstName">First name</label>
                    </div>
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.props.form, this.props.validation, 'lastName')}
                            id="lastName"
                            name="lastName"
                            onBlur={this.onFieldBlur.lastName}
                            onChange={this.onFieldChanged.lastName}
                            type="text"
                            value={this.props.form.lastName}
                        />
                        <label data-validation-message={getValidationMessage(this.props.validation, 'lastName')} htmlFor="lastName">Last name</label>
                    </div>
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.props.form, this.props.validation, 'username')}
                            id="username"
                            name="username"
                            onBlur={this.onFieldBlur.username}
                            onChange={this.onFieldChanged.username}
                            type="text"
                            value={this.props.form.username}
                        />
                        <label data-validation-message={getValidationMessage(this.props.validation, 'username')} htmlFor="username">Username</label>
                    </div>
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.props.form, this.props.validation, 'password')}
                            id="password"
                            name="password"
                            onBlur={this.onFieldBlur.password}
                            onChange={this.onFieldChanged.password}
                            type="password"
                            value={this.props.form.password}
                        />
                        <label data-validation-message={getValidationMessage(this.props.validation, 'password')} htmlFor="password">Password</label>
                    </div>
                    <div className="formfield">
                        <input
                            className={getValidationClassName(this.props.form, this.props.validation, 'confirmPassword')}
                            id="confirmPassword"
                            name="confirmPassword"
                            onBlur={this.onFieldBlur.confirmPassword}
                            onChange={this.onFieldChanged.confirmPassword}
                            type="password"
                            value={this.props.form.confirmPassword}
                        />
                        <label data-validation-message={getValidationMessage(this.props.validation, 'confirmPassword')} htmlFor="confirmPassword">Confirm password</label>
                    </div>
                    <div className="formactions">
                        <div>
                            <button onClick={this.onSubmit}>Submit</button>
                        </div>
                        <div>
                            {(this.props.validation && this.props.validation.isValid) ? 'Can Submit' : 'Cannot Submit Yet'}
                        </div>
                    </div>
                </div>
                <pre id="current-state">
                    {JSON.stringify(this.props.validation, null, 2)}
                </pre>
            </div>
        );
    }
}

const ConnectedApp = connect((state) => state, {
    onFieldBlur,
    onFieldChanged,
    onFormSubmit
})(App);

// eslint-disable-next-line react/display-name, react/no-multi-comp
export default () => (
    <Provider store={store}>
        <ConnectedApp />
    </Provider>
);
