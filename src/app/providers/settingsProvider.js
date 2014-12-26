(function () {
    'use strict';

    angular.module('quiz')
           .provider('settings', settingsProvider);

    function settingsProvider() {
        var settings,
            defaultSettings = {
                masteryScore: {score: 100}
            };

        return {
            setSettings: function (value) {
                if (!value) {
                    return;
                }

                settings = $.extend(true, {}, defaultSettings, value);
            },
            $get: function () {
                return settings;
            }
        };
    }
}());