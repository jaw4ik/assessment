(function () {
    'use strict';

    angular.module('bootstraping').factory('detectDeviceTask', detectDeviceTask);

    detectDeviceTask.$inject = ['$q', '$document'];

    function detectDeviceTask($q, $document) {
        var body = $document[0].body;
        body.className = body.className + (isMobileDevice() ? ' touch' : ' no-touch');
        return $q.when();
    }

    function isMobileDevice() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('ipod') !== -1 || ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('android') !== -1;
    }

}());