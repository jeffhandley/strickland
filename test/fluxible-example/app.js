import Fluxible from 'fluxible';
import { RouteStore } from 'fluxible-router';
import Application from './components/Application';
import routes from './configs/routes';
import ApplicationStore from './stores/ApplicationStore';

// create new fluxible instance
const app = new Fluxible({
    component: Application
});

// register routes
var MyRouteStore = RouteStore.withStaticRoutes(routes);
app.registerStore(MyRouteStore);

// register other stores
app.registerStore(ApplicationStore);

module.exports = app;
