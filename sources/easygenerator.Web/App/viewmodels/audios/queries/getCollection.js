define(['dataContext'], function (dataContext) {
    return {
        execute: function () {
            var dfd = Q.defer();
            dfd.resolve(dataContext.audios);
            return dfd.promise;
        }
    }

});