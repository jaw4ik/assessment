define(['../commands/vimeo'], function (vimeo) {

    return {
        getVideoDurations: getVideoDurations
    }

    function getVideoDurations(videos) {
        var arrayPromises = [];
        _.each(videos, function (video) {
            if (video.vimeoId) {
                arrayPromises.push(vimeo.getVideoDuration(video.vimeoId).then(function (duration) {
                    video.duration = duration;
                }));
            }
        });

        return Q.allSettled(arrayPromises);
    }
});