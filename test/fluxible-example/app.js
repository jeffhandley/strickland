import Fluxible from 'fluxible';
import { RouteStore } from 'fluxible-router';
import Application from './components/Application';
import routes from './configs/routes';
import ApplicationStore from './stores/ApplicationStore';

// create new fluxible instance
const app = new Fluxible({
    component: Application
});

app.plug({
    name: 'strickland',
    plugContext: function (options) {
        return {
            plugComponentContext(componentContext) {
                componentContext.validate = function() {
                    console.log('componentContext.validate');
                };
            },

            plugActionContext(actionContext) {
                actionContext.validate = function() {
                    console.log('actionContext.validate');
                };
            },

            plugStoreContext(storeContext) {
                storeContext.validate = function() {
                    console.log('storeContext.validate');
                };
            }
        };
    }
});

// register routes
var MyRouteStore = RouteStore.withStaticRoutes(routes);
app.registerStore(MyRouteStore);

// register other stores
app.registerStore(ApplicationStore);

module.exports = app;
