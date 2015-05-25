define(['analytics/providers/consoleProvider', 'analytics/providers/mixpanelProvider', 'analytics/providers/nudgespotProvider'],
    function (consoleProvider, mixpanelProvider, nudgespotProvider) {

        var providers = [];

        function identify() {
            _.each(providers, function (provider) {
                if (_.isFunction(provider.identify))
                    provider.identify();
            });
        };

        function publish(eventName, category) {
            _.each(providers, function (provider) {
                provider.trackEvent(eventName, category);
            });
        }

        function initialize() {
            if (!has('release')) {
                providers.push(consoleProvider());
            }
            providers.push(mixpanelProvider());
            providers.push(nudgespotProvider());
            identify();
        }

        return {
            initialize: initialize,
            publish: publish
        };
    });