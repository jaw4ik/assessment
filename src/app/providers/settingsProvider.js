(function () {
    'use strict';

    angular.module('quiz')
           .provider('settings', settingsProvider);

    function settingsProvider() {
        var settings;
        settings = {
            masteryScore: {score: 90}
        };

        return {
            setSettings: function (value) {
                if (!value) {
                    return;
                }

                settings = value;
            },
            $get: function () {
                return settings;
            }
        };
    }
}());