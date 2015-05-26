'use strict';
var React = require('react');
var changeTitle = require('../actions/ChangeTitle');
var TextField = require('./TextField');

class ChangeTitleForm extends React.Component {
    handleTitleChange(event) {
        this.context.executeAction(changeTitle, event.target.value);
    }

    render() {
        return (
            <form action="#">
                <TextField onChange={this.handleTitleChange.bind(this)} />
            </form>
        );
    }
}

ChangeTitleForm.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    validate: React.PropTypes.func.isRequired
};

module.exports = ChangeTitleForm;
