(function () {
    'use strict';

    angular.module('quiz')
           .service('imageLoaderService', imageLoaderService);

    imageLoaderService.$inject = ['$q'];

    function imageLoaderService($q) {
        var that = this;
        that.load = load;

        function load(url) {
            var deferred = $q.defer();

            var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var maxSize = browserWidth > browserHeight ? browserWidth : browserHeight;

            var resizedImageUrl = url + '?height=' + maxSize + '&width=' + maxSize;
            var image = new Image();
            image.className = 'image';
            image.style.display = "none";
            image.onload = function () {
                deferred.resolve(image);
            }
            image.onerror = function () {
                deferred.reject(undefined);
            }
            image.src = resizedImageUrl;

            return deferred.promise;
        }
    }

}());