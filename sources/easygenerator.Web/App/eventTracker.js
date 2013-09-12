define(['durandal/system', 'plugins/router'],
    function (system, router) {

        var providers = [];

        function googleAnalyticsProvider() {
            var
                trackEvent = function (eventName, eventCategory) {
                    if (!window._gaq) {
                        return;
                    }
                    
                    window._gaq.push(['_trackEvent', eventCategory, eventName]);
                };

            return {
                trackEvent: trackEvent
            };
        }

        function consoleProvider() {
            var
                trackEvent = function (eventName, eventCategory) {
                    if (!window.console) {
                        return;
                    }
                    system.log('Tracking event: [' + eventCategory + '].[' + eventName + ']');
                };

            return {
                trackEvent: trackEvent
            };
        }

        providers.push(new googleAnalyticsProvider());
        providers.push(new consoleProvider());

        function publish(eventName) {
            var activeInstruction = router.activeInstruction();
            var eventCategory = _.isObject(activeInstruction) ? activeInstruction.config.title: 'Default category' ;

            _.each(providers, function (provider) {
                provider.trackEvent(eventName, eventCategory);
            });
        }

        return {
            publish: publish
        };
    });