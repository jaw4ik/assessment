define(['dataContext'], function (dataContext) {

    var getCollection = function () {
        var deferred = Q.defer();

        deferred.resolve(dataContext.videos);

        return deferred.promise;
    },

    getById = function (id) {
        var deferred = Q.defer();

        if (_.isNullOrUndefined(id)) {
            throw 'Invalid argument';
        }

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
        if (!_.isObject(video)) {
            throw 'Video is not an object.';
        }

        dataContext.videos.push(video);
    };

    return {
        getCollection: getCollection,
        getById: getById,
        addVideo: addVideo
    };
});
