define(['durandal/system'],
    function (system) {

        var providers = [];

        function googleAnalyticsProvider() {
            var
                trackEvent = function (eventName) {
                    if (!window._gaq) {
                        return;
                    }
                    window._gaq.push(['_trackEvent', 'Default category', eventName]);
                };

            return {
                trackEvent: trackEvent
            };
        }

        function consoleProvider() {
            var
                trackEvent = function (eventName) {
                    if (!window.console) {
                        return;
                    }
                    system.log('Tracking event: [' + eventName + ']');
                };

            return {
                trackEvent: trackEvent
            };
        }

        providers.push(new googleAnalyticsProvider());
        providers.push(new consoleProvider());

        function publish(eventName) {
            _.each(providers, function(provider) {
                provider.trackEvent(eventName);
            });
        }

        return {
            publish: publish
        };
    });