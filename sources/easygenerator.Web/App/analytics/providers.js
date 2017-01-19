define(['has', 'analytics/providers/consoleProvider', 'analytics/providers/mixpanelProvider', 'analytics/providers/intercomProvider'],
    function (has, consoleProvider, mixpanelProvider, IntercomProvider) {
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
        providers.push(new IntercomProvider());
        providers.identify();

        function publish(eventName, category, properties) {
            _.each(providers, function (provider) {
                provider.trackEvent(eventName, category, properties);
            });
        }

        return {
            publish: publish
        };
    });