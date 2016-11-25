var app = app || {};

(function(application) {

    function mixpanelAnalyticsProvider() {
        return {
            trackEvent: function(eventName, eventProperties) {
                var peopleSetDeferred = $.Deferred(),
                    trackEventDeferred = $.Deferred();

                var mixpanel = window.mixpanel;

                if (mixpanel) {
                    var username = eventProperties.username;
                    var properties = {};

                    if (username) {
                        var peopleProperties = {};

                        mixpanel.identify(username);

                        if (eventName === application.constants.events.signupSecondStep) {
                            mixpanel.alias(username);
                            _.extend(peopleProperties, {
                                "$email": username,
                                "$name": username,
                                "$created": new Date()
                            });
                        }

                        if (eventName === application.constants.events.signin) {
                            _.extend(peopleProperties, {
                                "$last_login": new Date()
                            });
                        }

                        if (eventProperties.role) {
                            properties.Role = eventProperties.role;
                            _.extend(peopleProperties, {
                                "Role": eventProperties.role
                            });
                        }

                        _.isEmpty(peopleProperties) ? peopleSetDeferred.resolve() : mixpanel.people.set(peopleProperties, function() {
                            peopleSetDeferred.resolve();
                        });

                        properties.Email = username;

                        mixpanel.track(eventName, properties, function() {
                            trackEventDeferred.resolve();
                        });

                        _.delay(resolveAll, application.constants.timeout.mixpanel);
                    } else {
                        console.error('mixpanel can\'t identify a user');
                        resolveAll();
                    }
                } else {
                    resolveAll();
                }

                function resolveAll() {
                    trackEventDeferred.resolve();
                    peopleSetDeferred.resolve();
                }

                return $.when(peopleSetDeferred, trackEventDeferred);
            }
        };
    }

    function googleAnalyticsProvider() {
        return {
            trackEvent: function(eventName, eventProperties) {
                var deferred = jQuery.Deferred();
                var gaq = window._gaq;

                if (gaq) {
                    gaq.push(['_set', 'hitCallback', resolve]);
                    gaq.push(['_trackEvent', 'easygenerator application', 'Account', eventName]);
                    _.delay(resolve, application.constants.timeout.googleAnalytics);
                } else {
                    resolve();
                }

                function resolve() {
                    deferred.resolve();
                }

                return deferred.promise();
            },
            trackPageview: function(url) {
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
    var googleProvider = googleAnalyticsProvider();

    application.trackEvent = function(eventName, eventProperties) {
        return jQuery.when(
            mixpanelProvider.trackEvent(eventName, eventProperties),
            googleProvider.trackEvent(eventName, eventProperties)
        );
    };

    application.trackPageview = function(url) {
        return jQuery.when(
            googleProvider.trackPageview(url)
        );
    };

}(app));
