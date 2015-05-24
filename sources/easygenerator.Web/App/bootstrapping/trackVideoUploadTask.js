define(['videoUpload/upload'], function (videoUpload) {

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        videoUpload.initialize();
    }
});