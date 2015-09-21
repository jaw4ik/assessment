define(['Query', 'dataContext'], function(Query, dataContext) {

    return new Query(function () {
        var dfd = Q.defer();

        dfd.resolve(dataContext.audios.filter(function (audio) {
            return !audio.available;
        }));

        return dfd.promise;
    });

})