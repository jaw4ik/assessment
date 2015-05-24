define(['../commands/vimeo'], function (vimeo) {

    return {
        getThumbnailUrls: getThumbnailUrls
    }

    function getThumbnailUrls(videos) {
        var arrayPromises = [];
        _.each(videos, function (video) {
            if (video.vimeoId) {
                arrayPromises.push(vimeo.getThumbnailUrl(video.vimeoId).then(function (thumbnailUrl) {
                    video.thumbnailUrl = thumbnailUrl;
                }));
            }
        });

        return $.when.apply($, arrayPromises);
    }
});