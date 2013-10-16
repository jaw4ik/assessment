define(['durandal/system', 'plugins/router', 'dataContext'],
    function (system, router, dataContext) {

        var providers = [];

        function mixpanelProvider() {
            var
                trackEvent = function (eventName, eventCategory) {
                    var mixpanel = window.mixpanel;
                    var username = dataContext.userName;

                    if (!mixpanel) {
                        return;
                    }

                    if (username) {
                        mixpanel.identify(username);
                    }

                    mixpanel.track(eventName, { Category: eventCategory });
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

        if (!has('release')) {
            providers.push(consoleProvider());
        }
        providers.push(mixpanelProvider());

        function publish(eventName) {
            var activeInstruction = router.activeInstruction();
            var eventCategory = _.isObject(activeInstruction) ? activeInstruction.config.title : 'Default category';

            _.each(providers, function (provider) {
                provider.trackEvent(eventName, eventCategory);
            });
        }

        return {
            publish: publish
        };
    });