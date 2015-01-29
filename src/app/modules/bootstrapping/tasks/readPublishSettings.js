(function () {
    'use strict';

    angular.module('bootstrapping').factory('readPublishSettingsTask', readPublishSettingsTask);

    readPublishSettingsTask.$inject = ['fileReadingService'];

    function readPublishSettingsTask(fileReadingService) {
        return fileReadingService.readJson('publishSettings.js');
    }

}());