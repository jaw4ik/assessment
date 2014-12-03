(function () {
    'use strict';

    angular.module('quiz')
           .service('imageLoaderService', imageLoaderService);

    imageLoaderService.$inject = ['$q'];

    function imageLoaderService($q) {
        var that = this;
        that.load = load;

        function load(url, width, height, scaleBySmallerSide) {
            var deferred = $q.defer();

            var maxSize = width > height ? width : height;

            var resizedImageUrl = url + '?height=' + maxSize + '&width=' + maxSize + (scaleBySmallerSide ? '&amp;scaleBySmallerSide=true' : '');
            var image = new Image();
            image.className = 'image';
            image.style.display = "none";
            image.style.maxWidth = width + 'px';
            image.style.maxHeight = height + 'px';
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