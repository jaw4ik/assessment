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
                        if (eventProperties.role) {
                            properties.Role = eventProperties.role;
                            mixpanel.people.set({
                                "Role": eventProperties.role
                            });
                        }

                        properties.Email = username;

                        mixpanel.track(eventName, properties, resolve);
                        _.delay(resolve, application.constants.timeout.mixpanel);
                    } else {
                        console.error('mixpanel can\'t identify a user');
                        resolve();
                    }
                } else {
                    resolve();
                }

                function resolve() {
                    deferred.resolve();
                }

                return deferred.promise();
            }
        };
    }

    function nudgespotAnalyticsProvider() {
        return {
            trackEvent: function (eventName, eventProperties) {
                var deferred = jQuery.Deferred();
                var nudgespot = window.nudgespot;

                if (nudgespot) {
                    var username = eventProperties.username;
                    var firstname = eventProperties.firstname;
                    var lastname = eventProperties.lastname;

                    var properties = {};

                    if (username) {
                        nudgespot.identify(username, { "first_name": firstname, "last_name": lastname });
                        properties.email = username;

                        nudgespot.track(eventName, properties);
                        _.delay(resolve, application.constants.timeout.nudgespot);
                    } else {
                        console.error('nudgespot can\'t identify a user');
                        resolve();
                    }
                } else {
                    resolve();
                }

                function resolve() {
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
                    gaq.push(['_set', 'hitCallback', resolve]);
                    gaq.push(['_trackEvent', 'Account', eventName]);
                    _.delay(resolve, application.constants.timeout.googleAnalytics);
                } else {
                    resolve();
                }

                function resolve() {
                    deferred.resolve();
                }

                return deferred.promise();
            },
            trackPageview: function (url) {
                var deferred = jQuery.Deferred();
                var gaq = window._gaq;

                if (gaq) {
                    gaq.push(['_set', 'hitCallback', resolve]);
                    gaq.push(['_trackPageview', url]);
                    _.delay(resolve, application.constants.timeout.googleAnalytics);
                } else {
                    resolve();
                }

                function resolve() {
                    deferred.resolve();
                }

                return deferred.promise();
            }
        };
    }

    var mixpanelProvider = mixpanelAnalyticsProvider();
    var nudgespotProvider = nudgespotAnalyticsProvider();
    var googleAnalyticesProvider = googleAnalyticsProvider();

    application.trackEvent = function (eventName, eventProperties) {
        return jQuery.when(
            nudgespotProvider.trackEvent(eventName, eventProperties),
            mixpanelProvider.trackEvent(eventName, eventProperties)
        );
    };

    application.trackPageview = function (url) {
        return jQuery.when(
            googleAnalyticesProvider.trackPageview(url)
        );
    };

}(app))