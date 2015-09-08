define(['dataContext'], function (dataContext) {

    return {
        execute: function () {
            var dfd = Q.defer();
            dfd.resolve(_.sortBy(dataContext.audios, 'createdOn').reverse());
            return dfd.promise;
        }
    }

});