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
                        if (eventName == application.constants.events.signupSecondStep) {
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

    function googleAnalyticsProvider() {
        return {
            trackEvent: function (eventName, eventProperties) {
                var deferred = jQuery.Deferred();
                var gaq = window._gaq;

                if (gaq) {
                    gaq.push(['_set', 'hitCallback', function () {
                        deferred.resolve();
                    }]);
                    gaq.push(['_trackEvent', 'Account', eventName]);
                } else {
                    deferred.resolve();
                }

                return deferred.promise();
            }
        };
    }

    var mixpanelAnalyticesProvider = mixpanelAnalyticsProvider();
    var googleAnalyticesProvider = googleAnalyticsProvider();

    application.trackEvent = function (eventName, eventProperties) {
        return jQuery.when(
            mixpanelAnalyticesProvider.trackEvent(eventName, eventProperties),
            googleAnalyticesProvider.trackEvent(eventName, eventProperties)
        );
    };

}(app))