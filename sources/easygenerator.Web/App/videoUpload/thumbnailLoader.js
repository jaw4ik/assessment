define(['constants'], function (constants) {

    return {
        getThumbnailUrls: getThumbnailUrls
    }

    function getThumbnailUrls(videos) {
        var arrayPromises = [];
        _.each(videos, function(video) {
            arrayPromises.push(getThumbnailUrl(video.vimeoId).then(function(thumbnailUrl) {
                video.thumbnailUrl = thumbnailUrl;
            }));
        });

        return $.when.apply($, arrayPromises);
    }

    function getThumbnailUrl(vimeoId) {
        var deferred = $.Deferred();

        $.ajax({
            url: constants.messages.storage.video.thumbnailLoadUrl + vimeoId + '.json',
            method: 'GET',
            global: false
        }).then(function(data) {
            if (!data.length || !data[0]['thumbnail_medium']) {
                deferred.resolve(constants.messages.storage.video.defaultThumbnailUrl);
                return;
            }
            deferred.resolve(data[0]['thumbnail_medium']);
        }).fail(function() {
            deferred.resolve(constants.messages.storage.video.defaultThumbnailUrl);
        });

        return deferred.promise();
    }
});