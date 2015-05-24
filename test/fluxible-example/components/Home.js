'use strict';
var React = require('react');

class Home extends React.Component {
    render() {
        console.log('Home', 'this.context', this.context);
        console.log('Home', 'this.props.context', this.props.context);

        return (
            <div>
                <h2>Home</h2>
                <p>Welcome to the site!</p>
            </div>
        );
    }
}

Home.contextTypes = {
    validate: React.PropTypes.func.isRequired
};

module.exports = Home;
