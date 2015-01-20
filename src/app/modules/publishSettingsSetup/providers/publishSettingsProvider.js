(function () {
    'use strict';

    angular.module('quiz.publishSettingsSetup')
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