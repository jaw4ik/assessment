define(['userContext'],
    function (userContext) {

        return function () {
            var
                trackEvent = function (eventName, eventCategory, properties) {
                    var mixpanel = window.mixpanel;
                    if (!mixpanel) {
                        return;
                    }

                    var username = '',
                        role = null;

                    if (_.isObject(userContext.identity)) {
                        username = userContext.identity.email;
                        role = userContext.identity.role;
                    }

                    var eventProperties = {
                        Category: eventCategory
                    };

                    if (username) {
                        eventProperties.Email = username;
                    }

                    if (role) {
                        eventProperties.Role = role;
                        mixpanel.people.set({
                            "Role": role
                        });
                    }

                    if (properties) {
                        for (var property in properties) {
                            if (properties.hasOwnProperty(property)) {
                                eventProperties[property] = properties[property];
                            }
                        }
                    }

                    mixpanel.people.set({
                        "$last_seen": new Date()
                    });

                    mixpanel.track(eventName, eventProperties);
                },

                identify = function () {
                    var mixpanel = window.mixpanel;
                    if (!mixpanel) {
                        return;
                    }

                    var username = _.isObject(userContext.identity) ? userContext.identity.email : '';
                    if (username) {
                        mixpanel.identify(username);
                    } else {
                        console.error('mixpanel can\'t identify a user');
                    }
                };

            return {
                trackEvent: trackEvent,
                identify: identify
            };
        }
    });