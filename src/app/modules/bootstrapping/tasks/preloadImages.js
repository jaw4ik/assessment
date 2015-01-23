(function () {
    'use strict';

    angular.module('bootstrapping').factory('preloadImages', preloadImages);

    preloadImages.$inject = ['$q'];
    
    var imagesStack = [
        'css/img/main-background.jpg'
    ];

    function preloadImages($q) {
        var promises = [];

        imagesStack.forEach(function (url) {
            var defer = $q.defer();

            $('<img />').attr('src', url).load(function () {
                defer.resolve();
            });

            promises.push(defer.promise);
        });

        return $q.all(promises);
    }

})();