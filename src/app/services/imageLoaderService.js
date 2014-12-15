(function () {
    'use strict';

    angular
        .module('quiz')
        .service('imageLoaderService', imageLoaderService);

    imageLoaderService.$inject = ['$q'];

    function imageLoaderService($q) {
        var that = this;
        that.load = load;

        function load(url) {
            var deferred = $q.defer();
            var image = new Image();

            image.onload = function () {
                deferred.resolve(image);
            };
            image.onerror = function () {
                deferred.reject(undefined);
            };
            image.src = url;

            return deferred.promise;
        }
    }

}());