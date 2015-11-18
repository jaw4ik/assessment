define(['http/storageHttpWrapper', 'userContext', 'constants', 'dataContext', 'durandal/app'],
    function (storageHttpWrapper, userContext, constants, dataContext, app) {
        "use strict";

        return {
            execute: function (videoId) {
                return storageHttpWrapper.post(constants.storage.host + constants.storage.video.deleteUrl, { videoId: videoId })
                    .then(function () {
                        dataContext.videos = _.reject(dataContext.videos, function (video) {
                            return video.id === videoId;
                        });

                        userContext.identifyStoragePermissions().then(function () {
                            app.trigger(constants.storage.changesInQuota);
                        });
                    });
            }
        };

    });