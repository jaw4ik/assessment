define(['durandal/system', 'audio/vimeo/availabilityTracker', 'constants'], function (system, availabilityTracker, constants) {

    return {
        initialize: initialize
    };


    function initialize() {
        (function schedule() {
            //system.log('Tracking audios..');
            availabilityTracker.track().finally(function () {
                _.delay(schedule, constants.storage.audio.trackerTimeout);
            });
        })();
    }
});
