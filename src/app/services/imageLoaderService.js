(function () {
    'use strict';

    angular.module('quiz')
        .service('imageLoaderService', ImageLoaderService);

    ImageLoaderService.$inject = ['$q'];

    function ImageLoaderService($q) {
        this.load = function (url) {
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
        };
    }

}());