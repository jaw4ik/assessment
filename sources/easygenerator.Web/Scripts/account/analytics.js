var app = app || {};

(function (application) {

    function mixpanelAnalyticsProvider() {
        return {
            trackEvent: function (eventName, eventProperties) {
                var deferred = jQuery.Deferred();
                
                var mixpanel = window.mixpanel;
                if (mixpanel) {
                    var username = eventProperties.username;
                    var properties = {};

                    if (username) {
                        mixpanel.identify(username);
                        if (eventName == application.constants.events.signup) {
                            mixpanel.alias(username);
                            mixpanel.people.set({
                                "$email": username,
                                "$name": username,
                                "$created": new Date()
                            });
                        }

                        if (eventName == application.constants.events.signin) {
                            mixpanel.people.set({
                                "$last_login": new Date()
                            });
                        }

                        properties.Email = username;
                    }
                    mixpanel.track(eventName, properties, function () {
                        deferred.resolve();
                    });

                } else {
                    deferred.resolve();
                }

                return deferred.promise();
            }
        };
    }

    var mixpanelAnalyticesProvider = mixpanelAnalyticsProvider();

    application.trackEvent = function (eventName, eventProperties) {
        return mixpanelAnalyticesProvider.trackEvent(eventName, eventProperties);
    };

}(app))