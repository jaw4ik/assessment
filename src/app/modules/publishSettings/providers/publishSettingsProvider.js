(function () {
    'use strict';

    angular.module('quiz.publishSettings')
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