(function () {
    'use strict';

    angular.module('assessment.publishSettings')
           .provider('publishSettings', settingsProvider);

    function settingsProvider() {
        var settings;

        return {
            setSettings: function (value) {
                settings = value;
            },
            $get: function () {
                return settings;
            }
        };
    }
}());