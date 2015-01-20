(function () {
    'use strict';

    angular.module('bootstraping').factory('readPublishSettingsTask', readPublishSettingsTask);

    readPublishSettingsTask.$inject = ['fileReadingService'];

    function readPublishSettingsTask(fileReadingService) {
        return fileReadingService.readJson('publishSettings.js');
    }

}());