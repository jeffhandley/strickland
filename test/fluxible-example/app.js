import Fluxible from 'fluxible';
import { RouteStore } from 'fluxible-router';
import Application from './components/Application';
import routes from './configs/routes';
import ApplicationStore from './stores/ApplicationStore';
import Validation from '../../src/validation-plugin';

// create new fluxible instance
const app = new Fluxible({
    component: Application
});

app.plug(require('../../src/validation-plugin'));

// register routes
var MyRouteStore = RouteStore.withStaticRoutes(routes);
app.registerStore(MyRouteStore);

// register other stores
app.registerStore(ApplicationStore);

module.exports = app;
