define(['durandal/system', 'plugins/router', 'userContext'],
    function (system, router, userContext) {

        var providers = [];

        function mixpanelProvider() {
            var
                trackEvent = function (eventName, eventCategory) {
                    var mixpanel = window.mixpanel;
                    var username = _.isObject(userContext.identity) ? userContext.identity.email : '';

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

        function publish(eventName, eventCategory) {
            var activeInstruction = router.activeInstruction();

            var category = '';

            if (_.isString(eventCategory)) {
                category = eventCategory;
            } else {
                category = _.isObject(activeInstruction) ? activeInstruction.config.title : 'Default category';
            }

            _.each(providers, function (provider) {
                provider.trackEvent(eventName, category);
            });
        }

        return {
            publish: publish
        };
    });