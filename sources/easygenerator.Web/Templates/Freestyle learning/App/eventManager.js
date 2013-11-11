define(['durandal/app'],
    function (app) {

        var
            events = {
                courseStarted: "courseStarted",
                courseStopped: "courseStopped",
                courseFinished: "courseFinished"
            },

            turnAllEventsOff = function () {
                _.each(events, function (event) {
                    app.off(event);
                });
            },

            subscribeForEvent = function (event) {
                if (!events.hasOwnProperty(event)) {
                    throw 'Unsupported event';
                }

                return app.on(event);
            };

        return {
            events: events,
            turnAllEventsOff: turnAllEventsOff,
            subscribeForEvent: subscribeForEvent
        };
    }
);