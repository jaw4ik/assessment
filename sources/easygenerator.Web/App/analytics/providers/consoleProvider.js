define(['durandal/system'],
    function (system) {
        return function() {
            var
                trackEvent = function (eventName, eventCategory, properties) {
                    if (!window.console) {
                        return;
                    }

                    var statement = 'Tracking event: [' + eventCategory + '].[' + eventName + ']';
                    if (properties) {
                        statement += '.[' + JSON.stringify(properties) + ']';
                    }

                    system.log(statement);
                };

            return {
                trackEvent: trackEvent
            };
        }
    });