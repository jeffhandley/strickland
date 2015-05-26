module.exports = {
    name: 'strickland',
    
    plugContext: function (options) {
        return {
            plugComponentContext(componentContext) {
                componentContext.validate = function(value) {
                    console.log('componentContext.validate', value);
                };
            },

            plugActionContext(actionContext) {
                actionContext.validate = function(value) {
                    console.log('actionContext.validate', value);
                };
            },

            plugStoreContext(storeContext) {
                storeContext.validate = function(value) {
                    console.log('storeContext.validate', value);
                };
            }
        };
    }
}