define(['videoUpload/uploadTracking'], function (uploadTracking) {

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        uploadTracking.initialize();
    }
});