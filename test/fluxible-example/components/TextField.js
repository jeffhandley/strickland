var React = require('react');

class TextField extends React.Component {
    handleChange(event) {
        this.context.validate(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    }

    render() {
        return <input type="text" onChange={ this.handleChange.bind(this) } />;
    }
}

TextField.contextTypes = {
    validate: React.PropTypes.func.isRequired
};

module.exports = TextField;
