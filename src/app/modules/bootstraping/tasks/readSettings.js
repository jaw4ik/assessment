(function () {
    'use strict';

    angular.module('bootstraping').factory('readSettingsTask', readSettingsTask);

    readSettingsTask.$inject = ['fileReadingService'];

    function readSettingsTask(fileReadingService) {
        return fileReadingService.readJson('settings.js');
    }

}());