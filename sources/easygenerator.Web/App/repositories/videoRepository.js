define(['dataContext', 'guard'], function (dataContext, guard) {

    var getCollection = function () {
        var deferred = Q.defer();
        deferred.resolve(dataContext.videos);
        return deferred.promise;
    },

    getById = function (id) {
        var deferred = Q.defer();

        guard.throwIfNotString(id, 'Video id (string) was expected');

        var result = _.find(dataContext.videos, function (item) {
            return item.id === id;
        });

        if (_.isUndefined(result)) {
            deferred.reject('Video does not exist');
        } else {
            deferred.resolve(result);
        }

        return deferred.promise;
    },

    addVideo = function (video) {
        guard.throwIfNotAnObject(video, 'Video is not an object');
        guard.throwIfNotString(video.id, 'Video id is not a string');

        dataContext.videos.unshift(video);
    },

    removeVideo = function (id) {
        var videoToRemove = _.find(dataContext.videos, function (video) {
            return video.id === id;
        });
        if (videoToRemove) {
            var index = dataContext.videos.indexOf(videoToRemove);
            dataContext.videos.splice(index, 1);
            return true;
        }
        return false;
    }

    return {
        getCollection: getCollection,
        getById: getById,
        addVideo: addVideo,
        removeVideo: removeVideo
    };
});
