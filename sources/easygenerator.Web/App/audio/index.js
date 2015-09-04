define(['audio/vimeo/availabilityTracker', 'constants'], function (availabilityTracker, constants) {

    return {
        initialize: initialize
    };


    function initialize() {
        (function schedule() {
            console.log('scheduling action');
            availabilityTracker.track().finally(function() {
                _.delay(schedule, constants.audio.trackerTimeout);
            });
        });
    }
});
