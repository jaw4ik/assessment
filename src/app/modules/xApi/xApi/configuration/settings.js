(function () {
    'use strict';

    angular.module('assessment.xApi')
        .factory('xApiSettings', xApiSettings);

    xApiSettings.$inject = ['settings'];

    function xApiSettings(settingsProvider) {
        var settings = {
            xApi: {
                allowedVerbs: [],
                version: '1.0.0'
            },
            init: init
        };

        var defaultSettings = {
            lrs: {
                uri: '//reports.easygenerator.com/xApi/statements',
                authenticationRequired: false,
                credentials: {
                    username: '',
                    password: ''
                }
            },
            allowedVerbs: ['started', 'stopped', 'experienced', 'mastered', 'answered', 'passed', 'failed']
        };

        return settings;

        function init() {
            if (settingsProvider.xApi.selectedLrs !== 'default') {
                $.extend(settings.xApi, settingsProvider.xApi);
            } else {
                $.extend(settings.xApi, defaultSettings);
            }
        }
    }
}());