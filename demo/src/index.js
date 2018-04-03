import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, NavLink, Redirect} from 'react-router-dom';
import './index.css';
import AppWithReactState from './App-ReactState';
import AppWithRedux from './App-Redux';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1><img alt="logo" aria-label="Strickland demo" className="App-logo" src="https://raw.githubusercontent.com/jeffhandley/strickland/master/logo/strickland-black.png" /></h1>
                </header>
                <nav>
                    <ul>
                        <li><NavLink activeClassName="active" to="/react-state">React State</NavLink></li>
                        <li><NavLink activeClassName="active" to="/redux">Redux</NavLink></li>
                    </ul>
                </nav>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/react-state" />} />
                    <Route component={AppWithReactState} path="/react-state" />
                    <Route component={AppWithRedux} path="/redux" />
                </Switch>
            </div>
        </Router>
    ),
    document.getElementById('root')
);
registerServiceWorker();
