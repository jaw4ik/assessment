define(['durandal/app', 'constants', './uploadDataContext'], function (app, constants, uploadDataContext) {

    var videoConstants = constants.storage.video;

    return {

        initialize: function () {
            startTrackUploadProgress();
            startTrackUploadChanges();
        }
    };

    function startTrackUploadChanges() {
        setTimeout(function () {

            if (uploadDataContext.uploadChanged()) {
                uploadDataContext.uploadChanged(false);
                app.trigger(videoConstants.changesInUpload);
            }

            startTrackUploadChanges();

        }, videoConstants.trackChangesInUploadTimeout);
    }

    function startTrackUploadProgress() {
        setTimeout(function () {

            if (uploadDataContext.queueUploads.length) {
                var arrayPromises = [];

                _.each(uploadDataContext.queueUploads, function (item) {
                    if (item.handler) {
                        arrayPromises.push(item.handler().then(function () {
                            uploadDataContext.uploadChanged(true);
                        }));
                    }
                });

                Q.allSettled(arrayPromises).then(function () {
                    startTrackUploadProgress();
                });

            } else {
                startTrackUploadProgress();
            }

        }, videoConstants.trackChangesInUploadTimeout);
    }
})