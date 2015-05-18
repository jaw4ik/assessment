define(['videoUpload/videoUpload'], function (videoUpload) {

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        videoUpload.initialize();
    }
});