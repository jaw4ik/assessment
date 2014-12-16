(function () {
    'use strict';
    angular.module('bootstraping')
           .service('webFontLoaderService', webFontLoaderService);

    webFontLoaderService.$inject = ['$q'];

    function webFontLoaderService($q) {
        var that = this;
        that.load = load;

        function load() {
            var deferred = $q.defer();
            WebFont.load({
                custom: {
                    families: ['RobotoslabRegular', 'RobotoslabBold', 'Rabiohead', 'RobotoslabLight', 'TwCenMTCondensed', 'RobotoBold'],
                    urls: ['../css/fonts.css']
                },
                active: function () {
                    deferred.resolve();

                },
                inactive: function () {
                    deferred.reject('Browser does not support linked fonts or none of the fonts could be loaded!');
                }
            });
            return deferred.promise;
        }
    }

}());