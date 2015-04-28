define(['userContext'],
    function(userContext) {
        return function() {
            var
                trackEvent = function (eventName, eventCategory) {
                    var nudgespot = window.nudgespot;
                    if (!nudgespot) {
                        return;
                    }

                    var username = _.isObject(userContext.identity) ? userContext.identity.email : '';
                    var eventProperties = {
                        Category: eventCategory
                    };

                    if (username) {
                        eventProperties.Email = username;
                    }

                    nudgespot.track(eventName, eventProperties);
                },

                identify = function () {
                    var nudgespot = window.nudgespot;
                    if (!nudgespot) {
                        return;
                    }

                    var username = _.isObject(userContext.identity) ? userContext.identity.email : '';
                    var firstname = _.isObject(userContext.identity) ? userContext.identity.firstname : '';
                    var lastname = _.isObject(userContext.identity) ? userContext.identity.lastname : '';

                    if (username) {
                        nudgespot.identify(username, { "first_name": firstname, "last_name": lastname });
                    } else {
                        console.error('nudgespot can\'t identify a user');
                    }
                };

            return {
                trackEvent: trackEvent,
                identify: identify
            };
        }
    });