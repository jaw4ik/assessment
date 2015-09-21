define(['Query', 'vimeo/queries/getVideo'], function (Query, getVideo) {

    return new Query(function (obj) {
        return getVideo.execute(obj.vimeoId).then(function(video) {
            return video.status === 'available';
        });
    });

});