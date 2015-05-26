'use strict';
var React = require('react');
var ChangeTitleForm = require('./ChangeTitleForm');

class Home extends React.Component {
    render() {
        return (
            <div>
                <h2>Home</h2>
                <p>Welcome to the site!</p>
                <ChangeTitleForm />
            </div>
        );
    }
}

Home.contextTypes = {
    validate: React.PropTypes.func.isRequired
};

module.exports = Home;
