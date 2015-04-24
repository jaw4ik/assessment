define(['durandal/system'],
    function (system) {
        return function() {
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
    });