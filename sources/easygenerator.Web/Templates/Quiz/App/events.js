define(['durandal/app'],
    function (app) {

        var
            events = {
            courseStarted: "courseStarted",
            courseStopped: "courseStopped",
            courseFinished: "courseFinished"
            },
            
            turnAllEventsOff = function() {
                _.each(events, function (event) {
                    app.off(event);
                });
            };

        return {
            events: events,
            turnAllEventsOff: turnAllEventsOff
        };
    }
);