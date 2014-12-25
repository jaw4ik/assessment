(function () {
    'use strict';

    angular.module('bootstraping').factory('readSettingsTask', readSettingsTask);

    readSettingsTask.$inject = ['readSettingsService'];

    function readSettingsTask(readSettingsService) {
        return readSettingsService.read();
    }

}());