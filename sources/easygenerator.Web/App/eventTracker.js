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

                    var eventProperties = {
                        Category: eventCategory
                    };

                    if (username) {
                        mixpanel.identify(username);
                        eventProperties.Email = username;
                    }

                    mixpanel.track(eventName, eventProperties);
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