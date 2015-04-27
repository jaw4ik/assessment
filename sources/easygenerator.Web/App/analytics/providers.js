define(['analytics/providers/consoleProvider', 'analytics/providers/mixpanelProvider', 'analytics/providers/nudgespotProvider'],
    function (consoleProvider, mixpanelProvider, nudgespotProvider) {

        var providers = [];

        providers.identify = function () {
            _.each(providers, function (provider) {
                if (_.isFunction(provider.identify))
                    provider.identify();
            });
        };

        if (!has('release')) {
            providers.push(consoleProvider());
        }
        providers.push(mixpanelProvider());
        providers.push(nudgespotProvider());
        providers.identify();

        function publish(eventName, category) {
            _.each(providers, function (provider) {
                provider.trackEvent(eventName, category);
            });
        }

        return {
            publish: publish
        };
    });