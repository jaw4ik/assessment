define(['userContext'],
    function (userContext) {

        return function () {
            var
                trackEvent = function (eventName, eventCategory) {
                    var mixpanel = window.mixpanel;
                    if (!mixpanel) {
                        return;
                    }

                    var username = _.isObject(userContext.identity) ? userContext.identity.email : '',
                        role = _.isObject(userContext.identity) ? userContext.identity.role : null;

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