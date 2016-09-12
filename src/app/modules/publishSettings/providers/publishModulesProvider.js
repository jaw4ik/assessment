(function () {
    'use strict';

    angular.module('assessment.publishSettings')
           .provider('publishModules', modulesProvider);

    function modulesProvider() {
        var modules;

        return {
            set: function (value) {
                modules = value;
            },
            $get: function () {
                return modules;
            }
        };
    }
}());